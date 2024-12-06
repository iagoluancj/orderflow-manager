/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabase';
import Cookies from 'js-cookie';
import { CartItem, TypeItemPedido, TypePedido } from '@/Types/types';

export async function POST(request: Request) {
    try {
        const pedidoData = await request.json();
        const { cliente_id, mesa, itens } = pedidoData;


        if (!cliente_id || !mesa || !Array.isArray(itens) || itens.length === 0) {
            return NextResponse.json(
                { message: `Número da mesa, ID do cliente e itens do pedido são obrigatórios.` },
                { status: 400 }
            );
        }

        const createdDate = new Date();

        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .insert([
                {
                    cliente_id,
                    mesa,
                    status: 'aguard_aprovacao', 
                    created_at: createdDate,
                },
            ])
            .select()
            .single();

        if (pedidoError) {
            console.error('Erro ao criar o pedido:', pedidoError);
            return NextResponse.json(
                { message: 'Erro ao criar o pedido. Tente novamente.' },
                { status: 500 }
            );
        }

        const pedido_id = pedido.id;

        const itensComPedido = itens.map((item: TypeItemPedido) => ({
            pedido_id,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            observacao: item.observacao || null,
            created_at: createdDate,
        }));

        const { error: itensError } = await supabase
            .from('itenspedido')
            .insert(itensComPedido);

        if (itensError) {
            console.error('Erro ao criar os itens do pedido:', itensError);
            return NextResponse.json(
                { message: 'Erro ao adicionar os itens do pedido. Tente novamente.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Pedido e itens criados com sucesso!', pedido, itens: itensComPedido },
            { status: 201 }
        );
    } catch (error) {
        console.error('Erro no processo de criação do pedido:', error);
        return NextResponse.json(
            { message: 'Erro ao processar a criação do pedido. Tente novamente.' },
            { status: 500 }
        );
    }
}
