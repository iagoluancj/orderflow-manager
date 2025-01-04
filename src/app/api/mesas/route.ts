/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabase';

export async function GET(request: Request) {
    try {
        // Busca todas as mesas com seus respectivos status (livre/ocupada)
        const { data, error } = await supabase
            .from('mesas')
            .select(`
                id,
                name,
                capacity
            `);

        if (error) {
            console.error('Erro ao buscar as mesas:', error);
            return NextResponse.json(
                { message: 'Erro ao buscar as mesas. Tente novamente.' },
                { status: 500 }
            );
        }

        if (data) {
            console.log('Mesas obtidas com sucesso:', data);
            return NextResponse.json(
                { message: 'Mesas obtidas com sucesso!', mesas: data },
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
