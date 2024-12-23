"use client"

import NavbarComponent from '@/Components/Navbar';
import { SupaContext } from '@/Context';
import { TypePedido } from '@/Types/types';
import React, { useContext, useState } from 'react';;

const PedidosGerais = () => {
    const { contextPedidos } = useContext(SupaContext);
    const [ordenarPor, setOrdenarPor] = useState<'cliente' | 'mesa'>('cliente');


    // Filtrar pedidos não finalizados
    const pedidosNaoFinalizados = contextPedidos.filter(
        (pedido) =>
            pedido.status !== 'pedido_negado' &&
            pedido.status !== 'cancelado' &&
            pedido.status !== 'encerrado');

    // Agrupar pedidos por cliente
    const agrupados =
        ordenarPor === 'cliente'
            ? pedidosNaoFinalizados.reduce<Record<string, TypePedido[]>>((acc, pedido) => {
                if (!acc[pedido.cliente_id]) {
                    acc[pedido.cliente_id] = [];
                }
                acc[pedido.cliente_id].push(pedido);
                return acc;
            }, {})
            : pedidosNaoFinalizados.reduce<Record<string, TypePedido[]>>((acc, pedido) => {
                const key = `Mesa ${pedido.mesa}`;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(pedido);
                return acc;
            }, {});

    return (
        <>
            <NavbarComponent
                message="Garçom - Contas Cliente"
                isGarcom={true}
                cartQt={0}
            />
            <div style={{ padding: '1rem' }}>
                <h2>Pedidos em andamento</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <button
                        onClick={() =>
                            setOrdenarPor((prev) => (prev === 'cliente' ? 'mesa' : 'cliente'))
                        }
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Ordenar por {ordenarPor === 'cliente' ? 'Mesa' : 'Cliente'}
                    </button>
                </div>
                {Object.keys(agrupados).length === 0 ? (
                    <p>
                        <i>Nenhum pedido em andamento.</i>
                    </p>
                ) : (
                    Object.entries(agrupados).map(([key, pedidos]) => (
                        <div key={key} style={{ marginBottom: '2rem' }}>
                            <h3>{ordenarPor === 'cliente' ? `Cliente ID: ${key}` : key}</h3>
                            <ul>
                                {pedidos.map((pedido) => (
                                    <li key={pedido.id} style={{ marginBottom: '1rem' }}>
                                        <p>
                                            <strong>Pedido ID:</strong> {pedido.id}
                                        </p>
                                        <p>
                                            <strong>Mesa:</strong> {pedido.mesa}
                                        </p>
                                        <p>
                                            <strong>Status:</strong> {pedido.status}
                                        </p>
                                        <p>
                                            <strong>Total:</strong> R$
                                            {(pedido.itens ?? []).reduce(
                                                (acc, item) =>
                                                    acc + item.produto_preco * item.quantidade,
                                                0
                                            ).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => {
                                                // Implemente ações como expandir itens do pedido
                                            }}
                                        >
                                            Ver Itens
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};


export default PedidosGerais;
