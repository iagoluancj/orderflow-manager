/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        // const { pedido_id } = await request.json();
        const pedido_id = searchParams.get('pedido_id');

        if (!pedido_id) {
            return NextResponse.json(
                { message: 'ID do pedido é obrigatório.' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('itenspedido')
            .select(`
                id,
                pedido_id,
                produto_id,
                quantidade,
                observacao,
                created_at,
                updated_at,
                aproved_by,
                produtos (nome, preco)
            `)
            .eq('pedido_id', pedido_id);

        if (error) {
            console.error('Erro ao buscar os itens do pedido:', error);
            return NextResponse.json(
                { message: 'Erro ao buscar os itens do pedido. Tente novamente.' },
                { status: 500 }
            );
        }

        // Formatando o retorno
        const itensComNomeProduto = data.map(item => ({
            id: item.id,
            pedido_id: item.pedido_id,
            produto_id: item.produto_id,
            produto_nome: item.produtos.nome, 
            produto_preco: item.produtos.preco, 
            quantidade: item.quantidade,
            observacao: item.observacao,
            created_at: item.created_at,
            updated_at: item.updated_at,
            aproved_by: item.aproved_by,
        }));

        if (data) {
            return NextResponse.json(
                { message: 'Itens do pedido obtidos com sucesso!', itens: itensComNomeProduto  },
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
