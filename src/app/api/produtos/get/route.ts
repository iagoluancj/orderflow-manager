/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabase';

export async function GET(request: Request) {
    try {
        const { data, error } = await supabase
            .from('produtos')
            .select();

        if (error) {
            return NextResponse.json(
                { message: 'Erro ao buscar os produtos. Tente novamente.' },
                { status: 500 }
            );
        }

        if (data) {
            console.error(request);
            return NextResponse.json(
                { message: 'Produtos obtidos com sucesso!', produtos: data },
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
