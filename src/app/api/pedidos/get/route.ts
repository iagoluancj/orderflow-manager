/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabase';

export async function GET(request: Request) {
    try {
        // Busca os pedidos com `aproved_at = null` e `status = 'aguard_aprovacao'`
        const { data, error } = await supabase
            .from('pedidos')
            .select()
            .eq('aproved_at', null)
            .eq('status', 'aguard_aprovacao');

        if (error) {
            console.error('Erro ao buscar os pedidos:', error);
            return NextResponse.json(
                { message: 'Erro ao buscar os pedidos. Tente novamente.' },
                { status: 500 }
            );
        }

        if (data) {
            console.log('Pedidos obtidos com sucesso:', data);
            return NextResponse.json(
                { message: 'Pedidos obtidos com sucesso!', pedidos: data },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return NextResponse.json(
            { message: 'Erro ao processar a requisição. Tente novamente.' },
            { status: 500 }
        );
    }
}
