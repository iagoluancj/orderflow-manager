/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabase';

export async function GET(request: Request) {
    try {
        // Busca todas as mesas com seus respectivos status (livre/ocupada)
        const { data, error } = await supabase
            .from('associacoesmesas')
            .select(`
                *
            `);

        if (error) {
            console.error('Erro ao buscar as associações:', error);
            return NextResponse.json(
                { message: 'Erro ao buscar as mesas. Tente novamente.' },
                { status: 500 }
            );
        }

        if (data) {
            console.log('Associações obtidas com sucesso:', data);
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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mesa_id, inicio_ocupacao, usuario_id } = body;

        // Validação básica dos campos
        if (!mesa_id || !inicio_ocupacao) {
            return NextResponse.json(
                { message: 'Campos obrigatórios não fornecidos.' },
                { status: 400 }
            );
        }

        // Inserir a nova associação na tabela associacoes_mesas
        const { data, error } = await supabase
            .from('associacoesmesas')
            .insert({
                mesa_id,
                inicio_ocupacao,
                usuario_id
            })
            .select();

        if (error) {
            console.error('Erro ao criar a associação:', error);
            return NextResponse.json(
                { message: 'Erro ao criar a associação. Tente novamente.' },
                { status: 500 }
            );
        }

        if (data) {
            console.log('Associação criada com sucesso:', data);
            return NextResponse.json(
                { message: 'Associação criada com sucesso!', associacao: data[0] },
                { status: 201 }
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

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { usuario_id, fim_ocupacao } = body;

        // Validação básica dos campos
        if (!usuario_id || !fim_ocupacao) {
            return NextResponse.json(
                { message: 'Campos obrigatórios não fornecidos.' },
                { status: 400 }
            );
        }

        // Atualizar a associação onde fim_ocupacao é NULL para o usuário especificado
        const { data, error } = await supabase
            .from('associacoesmesas')
            .update({ fim_ocupacao })
            .eq('usuario_id', usuario_id)
            .is('fim_ocupacao', null) // Garante que só atualiza associações sem fim_ocupacao
            .select();

        if (error) {
            console.error('Erro ao atualizar fim_ocupacao:', error);
            return NextResponse.json(
                { message: 'Erro ao atualizar fim_ocupacao. Tente novamente.' },
                { status: 500 }
            );
        }

        if (data && data.length > 0) {
            console.log('fim_ocupacao atualizado com sucesso:', data);
            return NextResponse.json(
                { message: 'fim_ocupacao atualizado com sucesso!', associacao: data[0] },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: 'Nenhuma associação foi encontrada para atualizar.' },
                { status: 404 }
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
