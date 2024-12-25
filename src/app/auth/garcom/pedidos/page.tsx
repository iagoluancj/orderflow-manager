"use client"

import NavbarComponent from '@/Components/Navbar';
import { LiOrderItens, ViewOrders } from '@/Components/Navbar/styles';
import { SupaContext } from '@/Context';
import { TypeItemPedido, TypePedido } from '@/Types/types';
import React, { useContext, useEffect, useState } from 'react';;

const PedidosGerais = () => {
    const { contextPedidos } = useContext(SupaContext);
    const [pedidoItens, setPedidoItens] = useState<{ [key: number]: TypeItemPedido[] }>({});
    const [ordenarPor, setOrdenarPor] = useState<'cliente' | 'mesa'>('cliente');
    const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

    // Filtrar pedidos não finalizados
    const pedidosNaoFinalizados = contextPedidos.filter(
        (pedido) =>
            pedido.status !== 'pedido_negado' &&
            pedido.status !== 'cancelado' &&
            pedido.status !== 'encerrado');

    const toggleOrderItems = (pedidoId: number) => {
        console.log(pedidoItens)
        if (expandedOrders.includes(pedidoId)) {
            setExpandedOrders(expandedOrders.filter(id => id !== pedidoId));
        } else {
            setExpandedOrders([...expandedOrders, pedidoId]);
        }
    };

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

    useEffect(() => {
        const fetchAllItensPedidos = async () => {
            const pedidosComItens: { [key: number]: TypeItemPedido[] } = {};

            await Promise.all(
                contextPedidos
                    .filter(pedido =>
                        pedido.status !== 'pedido_negado' &&
                        pedido.status !== 'cancelado' &&
                        pedido.status !== 'encerrado')
                    .map(async (pedido: TypePedido) => {
                        const response = await fetch(`/api/itens-pedidos?pedido_id=${pedido.id}`, { method: 'GET' });
                        if (response.ok) {
                            const data = await response.json();
                            pedidosComItens[pedido.id] = data.itens;
                        }
                    })
            );
            setPedidoItens(pedidosComItens);
        };

        fetchAllItensPedidos();

    }, [contextPedidos]);

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
                                        <p
                                            style={{
                                                paddingLeft: '.5rem',
                                            }}
                                        >
                                            <span><strong>Total pedido: </strong></span>
                                            {`R$${pedidoItens[pedido.id]?.reduce(
                                                (acc, item) =>
                                                    acc + (item.produto_preco !== undefined ? item.quantidade * item.produto_preco : 0),
                                                0
                                            ).toFixed(2)}`}
                                        </p>
                                        <ViewOrders onClick={() => toggleOrderItems(pedido.id)}>
                                            {expandedOrders.includes(pedido.id) ? 'Esconder Itens' : 'Mostrar Itens'}
                                        </ViewOrders>
                                        {expandedOrders.includes(pedido.id) && (
                                            <ul
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    width: '100%',
                                                    gap: '1rem',
                                                    borderRadius: '12px',
                                                    boxShadow: '0px 6px 6px -2px rgba(0, 0, 0, 0.2)',
                                                    paddingBottom: '.5rem',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'start',
                                                        justifyContent: 'start',
                                                        width: '100%',
                                                        gap: '1rem',
                                                    }}
                                                >
                                                    {pedidoItens[pedido.id]?.map(item => (
                                                        <LiOrderItens key={item.id}>
                                                            <p><strong>{item.quantidade}x</strong>{` ${item.produto_nome}`}</p>
                                                            <p>{``}</p>
                                                            <p>
                                                                {item.produto_preco !== undefined
                                                                    ? `Valor un.: R$${item.produto_preco.toFixed(2)}`
                                                                    : 'Valor un.: R$ER.ROR'}
                                                            </p>
                                                            <p>{`Observação: ${item.observacao || 'Nenhuma'}`}</p>

                                                        </LiOrderItens>
                                                    ))}
                                                </div>
                                                <p
                                                    style={{
                                                        paddingLeft: '.5rem',
                                                    }}
                                                >
                                                    <span><strong>Total pedido: </strong></span>
                                                    {`R$${pedidoItens[pedido.id]?.reduce(
                                                        (acc, item) =>
                                                            acc + (item.produto_preco !== undefined ? item.quantidade * item.produto_preco : 0),
                                                        0
                                                    ).toFixed(2)}`}
                                                </p>
                                            </ul>
                                        )}
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