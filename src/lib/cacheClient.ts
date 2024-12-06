import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);

let clientCache: Set<string> = new Set();

export async function syncClientCache() {
    const { data, error } = await supabase.from('clientes').select('id');

    if (error) {
        console.error('Erro ao sincronizar clientes:', error);
        return;
    }

    clientCache = new Set(data.map((cliente) => cliente.id));

    const clientesChannel = supabase
        .channel('clientes-db-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'clientes',
            },
            (payload) => {
                console.log('Mudança recebida para clientes:', payload);

                if (payload.eventType === 'INSERT') {
                    clientCache.add(payload.new.id);
                } else if (payload.eventType === 'DELETE') {
                    clientCache.delete(payload.old.id);
                }
            }
        )
        .subscribe();

    return () => {
        clientesChannel.unsubscribe();
    };
}

export function isValidClient(clientId: string): boolean {
    return clientCache.has(clientId);
}

syncClientCache();
