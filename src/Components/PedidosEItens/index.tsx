import React, { useContext, useState } from 'react';
import Cookies from 'js-cookie';
import { ButtonOpenCancel, ButtonOpenConfirm, CartOpen, CartOpenContainer, ContainerButtons, LiOrderItens, Order, Orders, OrdersContainer, PedidoId, TitleOrder, ViewOrders } from '../Navbar/styles';
import { TypeItemPedido, TypePedido } from '@/Types/types';
import { Title } from '../Cardapio/styles';
import { FaCheck } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { SupaContext } from '@/Context';

type Props = {
    status: string;
    contextPedidos: TypePedido[];
    pedidoItens: { [key: number]: TypeItemPedido[] };
    isGarcom?: boolean;
};

const statusActions: {
    [key in 'aguard_aprovacao' | 'pronto' | 'em_fila' | 'em_andamento' | 'cancelado' | 'pedido_negado' | 'encerrado']?: {
        confirmAction: string;
        confirmText: string;
        cancelAction: string;
        cancelText: string;
    };
} = {
    aguard_aprovacao: {
        confirmAction: 'em_fila',
        confirmText: 'Aprovar Pedido',

        cancelAction: 'reprovar',
        cancelText: 'Reprovar Pedido',
    },
    pronto: {
        confirmAction: 'encerrado',
        confirmText: 'Finalizar Pedido',

        cancelAction: 'cancelar',
        cancelText: 'Cancelar Pedido',
    },
    em_fila: {
        confirmAction: 'em_andamento',
        confirmText: 'Iniciar Pedido',

        cancelAction: 'cancelar',
        cancelText: 'Cancelar Pedido',
    },
    em_andamento: {
        confirmAction: 'pronto',
        confirmText: 'Pedido Pronto',
        
        cancelAction: 'cancelar',
        cancelText: 'Cancelar Pedido',
    },
};

const PedidosEItens: React.FC<Props> = ({ status, contextPedidos, pedidoItens, isGarcom }) => {
    const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
    const [isMesaOpen, setIsMesaOpen] = useState(false);
    const { contextFuncionarios, updatePedido } = useContext(SupaContext);
    const [handleAcao, setHandleAcao] = useState('');
    const [currentPedidoId, setCurrentPedidoId] = useState(0);

    const toggleOrderItems = (pedidoId: number) => {
        setExpandedOrders((prev) =>
            prev.includes(pedidoId) ? prev.filter((id) => id !== pedidoId) : [...prev, pedidoId]
        );
    };


    const toggleMesa = (acao: string, pedidoId: number) => {
        setHandleAcao(acao)
        setCurrentPedidoId(pedidoId)
        setIsMesaOpen(!isMesaOpen);
    }

    const handleAlterarStatusPedido = (pedidoId: number, status: string) => {
        const email = Cookies.get('email_func');
        const funcionario = contextFuncionarios.find((funcionario) => funcionario.email === email);

        if (!funcionario) {
            console.error("Funcionário não logado.");
            return;
        }

        setIsMesaOpen(!isMesaOpen)
        updatePedido(pedidoId, funcionario.id, status);
    };

    return (
        <OrdersContainer $borderStatus={status}>
            <TitleOrder>{`Pedidos ${status}`}</TitleOrder>
            <Orders>
                {
                    contextPedidos
                        .filter(
                            pedido =>
                                pedido.status === status &&
                                (isGarcom
                                    ? true
                                    : pedido.cliente_id === Cookies.get('user_id'))
                        )
                        .length === 0 ? (
                        <p
                            style={{
                                textAlign: 'center',
                            }}
                        ><i>Nenhum pedido neste status.</i></p>
                    ) : (
                        contextPedidos.filter(
                            pedido =>
                                pedido.status === status &&
                                (isGarcom
                                    ? true
                                    : pedido.cliente_id === Cookies.get('user_id'))
                        )
                            .map((pedido: TypePedido) => (

                                <Order key={pedido.id}>
                                    <PedidoId><strong>Pedido:</strong> {`${pedido.id}`}</PedidoId>
                                    <p><strong>Sua mesa: </strong>{`${pedido.mesa}`}</p>
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
                                    {
                                        isGarcom && statusActions[pedido.status] && (
                                            <ContainerButtons>
                                                <ButtonOpenConfirm
                                                    style={{
                                                        padding: '8px',
                                                        background: '#4CAF50',
                                                    }}
                                                    onClick={() =>
                                                        handleAlterarStatusPedido(pedido.id, statusActions[pedido.status]!.confirmAction
                                                        )
                                                    }
                                                >
                                                    {statusActions[pedido.status]!.confirmText}
                                                </ButtonOpenConfirm>
                                                <ButtonOpenCancel
                                                    onClick={() =>
                                                        toggleMesa(statusActions[pedido.status]!.cancelAction, pedido.id)
                                                    }
                                                    style={{ padding: '8px' }}
                                                >
                                                    {statusActions[pedido.status]!.cancelText}
                                                </ButtonOpenCancel>
                                            </ContainerButtons>
                                        )}
                                </Order>
                            ))
                    )
                }
            </Orders>

            {isMesaOpen && (
                <CartOpenContainer>
                    <CartOpen
                        style={{
                            backgroundColor: '#3F3F3F',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '100%',
                            maxWidth: '500px',
                        }}
                    >
                        <Title
                            style={{
                                textAlign: 'center',
                            }}
                        >{`Realmente deseja ${handleAcao} o pedido ${currentPedidoId}?`}</Title>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                                gap: '1rem',
                            }}
                        >
                            <ButtonOpenConfirm
                                onClick={() => {
                                    const novoStatus = handleAcao === 'reprovar' ? 'pedido_negado' :
                                        handleAcao === 'cancelar' ? 'cancelado' : null;
                                    if (novoStatus) {
                                        handleAlterarStatusPedido(currentPedidoId, novoStatus);
                                    }
                                }}

                                style={{
                                    padding: "10px 20px",
                                    background: '#4CAF50',
                                }}
                            >
                                <FaCheck />

                                Confirmar
                            </ButtonOpenConfirm>
                            <ButtonOpenCancel
                                onClick={() => toggleMesa('', 0)}
                                style={{
                                    padding: "10px 20px",
                                }}
                            >
                                <IoMdClose />
                                Fechar
                            </ButtonOpenCancel>
                        </div>
                    </CartOpen>
                </CartOpenContainer>
            )}
        </OrdersContainer>
    );
};

export default PedidosEItens;