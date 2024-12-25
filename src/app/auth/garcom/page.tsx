"use client";

import { SupaContext } from "@/Context";
import { useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { TypeItemPedido, TypePedido } from "@/Types/types";
import NavbarComponent from "@/Components/Navbar";
import { GarcomContainer, GarcomPage, GarcomWrapper } from "./styles";
import PedidosEItens from "@/Components/PedidosEItens";

interface Solicitacao {
  mesaId: string;
  timestamp: number;
}

export default function Garcom() {
  const { contextPedidos, contextFuncionarios } = useContext(SupaContext);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  // const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  const [pedidoItens, setPedidoItens] = useState<{ [key: number]: TypeItemPedido[] }>({});
  // const [isMesaOpen, setIsMesaOpen] = useState(false);
  // const [handleAcao, setHandleAcao] = useState('');
  // const [currentPedidoId, setCurrentPedidoId] = useState(0);

  // const toggleOrderItems = (pedidoId: number) => {
  //   console.log(pedidoItens)
  //   if (expandedOrders.includes(pedidoId)) {
  //     setExpandedOrders(expandedOrders.filter(id => id !== pedidoId));
  //   } else {
  //     setExpandedOrders([...expandedOrders, pedidoId]);
  //   }
  // };

  // const toggleMesa = (acao: string, pedidoId: number) => {
  //   setHandleAcao(acao)
  //   setCurrentPedidoId(pedidoId)
  //   setIsMesaOpen(!isMesaOpen);
  // }

  // const handleAlterarStatusPedido = (pedidoId: number, status: string) => {
  //   const email = Cookies.get('email_func');
  //   const funcionario = contextFuncionarios.find((funcionario) => funcionario.email === email);

  //   if (!funcionario) {
  //     console.error("Funcionário não logado.");
  //     return;
  //   }

  //   // setIsMesaOpen(!isMesaOpen)
  //   updatePedido(pedidoId, funcionario.id, status);
  // };

  const fetchSolicitacoes = async () => {
    try {
      const response = await fetch("/api/waiter-request", { method: "GET" });
      if (!response.ok) {
        console.error("Erro ao buscar solicitações");
        return;
      }

      const data: Solicitacao[] = await response.json();
      setSolicitacoes(data);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
    }
  };

  const removerSolicitacao = async (mesaId: string) => {
    const email = Cookies.get('email_func');
    const funcionario = contextFuncionarios.find((funcionario) => funcionario.email === email);

    if (!funcionario) {
      console.error("Funcionário não logado.");
      return;
    } else {
      try {
        await fetch("/api/waiter-request", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mesaId }),
        });

        setSolicitacoes((prev) => prev.filter((s) => s.mesaId !== mesaId));
      } catch (error) {
        console.error("Erro ao remover solicitação:", error);
      }
    }
  };

  useEffect(() => {
    const fetchAllItensPedidos = async () => {
      const cachedData = JSON.parse(localStorage.getItem('pedidosComItens') || '{}');
      const pedidosAguardando = contextPedidos.filter(
        (pedido) =>
          (pedido.status === 'aguard_aprovacao' || pedido.status === 'pronto') &&
          !cachedData[pedido.id]
      );

      if (pedidosAguardando.length > 0) {
        const novosItens: { [key: number]: TypeItemPedido[] } = {};

        await Promise.all(
          pedidosAguardando.map(async (pedido: TypePedido) => {
            const response = await fetch(`/api/itens-pedidos?pedido_id=${pedido.id}`, { method: 'GET' });
            if (response.ok) {
              const data = await response.json();
              novosItens[pedido.id] = data.itens;
            }
          })
        );

        // Atualizar o cache do navegador
        const updatedCache = { ...cachedData, ...novosItens };
        localStorage.setItem('pedidosComItens', JSON.stringify(updatedCache));

        // Atualizar estado
        setPedidoItens(updatedCache);
      } else {
        setPedidoItens(cachedData);
      }
    };

    fetchAllItensPedidos();


    const interval = setInterval(fetchSolicitacoes, 1000);

    return () => clearInterval(interval);
  }, [contextPedidos]);

  return (
    <>
      <NavbarComponent message='Garçom' isGarcom={true} cartQt={undefined} />
      <div className="w-full max-w-4xl p-2 border-2 border-yellow-700 mt-3">
        <h3>Solicitações de apoio</h3>
        {solicitacoes.length > 0 ? (
          <div className="p-2 border-2 border-blue-500">
            <h3>Solicitações de apoio</h3>
            {solicitacoes.map((solicitacao, index) => (
              <div key={index} className="p-4 rounded shadow-md mb-4">
                <p><strong>Mesa:</strong> {solicitacao.mesaId}</p>
                <p><strong>Hora:</strong> {new Date(solicitacao.timestamp).toLocaleTimeString()}</p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => removerSolicitacao(solicitacao.mesaId)}
                >
                  Concluir Solicitação
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma solicitação de apoio no momento.</p>
        )}
      </div>
      <GarcomPage className="p-2">
        <p>Aqui serão exibidos os pedidos para aprovação, prontos para entregar e solicitações de chamadas.</p>
        <GarcomContainer>
          {contextPedidos.length > 0 ? (
            <GarcomWrapper>
              <PedidosEItens
                status="aguard_aprovacao"
                contextPedidos={contextPedidos}
                pedidoItens={pedidoItens}
                isGarcom={true}
              />
              {/* <OrdersContainer $borderStatus="aguard_aprovacao">
                <TitleOrder>Pedidos aguardando aprovação</TitleOrder>
                <Orders>
                  {
                    contextPedidos
                      .filter(
                        pedido =>
                          pedido.status === 'aguard_aprovacao'
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
                          pedido.status === 'aguard_aprovacao'
                      )
                        .map((pedido: TypePedido) => (

                          // Talvez organizar em tabela ou grid seja a melhor opção, analisar.
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
                            <button
                              className="bg-blue-500 text-black px-4 py-2 rounded mt-2"
                              onClick={() => handleAlterarStatusPedido(pedido.id, 'em_fila')}
                            >
                              Aprovar Pedido
                            </button>
                            <ButtonOpenCancel
                              // onClick={() => handleAlterarStatusPedido(pedido.id, 'pedido_negado')}
                              onClick={() => toggleMesa('reprovar', pedido.id)}
                              style={{ padding: '8px' }}>
                              Reprovar pedido
                            </ButtonOpenCancel>
                          </Order>
                        ))
                    )
                  }
                </Orders>
              </OrdersContainer> */}
              
              <PedidosEItens
                status="pronto"
                contextPedidos={contextPedidos}
                pedidoItens={pedidoItens}
                isGarcom={true}
              />
              {/* <OrdersContainer $borderStatus="pronto">
                <TitleOrder>Pedidos prontos</TitleOrder>
                <Orders>
                  {
                    contextPedidos
                      .filter(
                        pedido =>
                          pedido.status === 'pronto'
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
                          pedido.status === 'pronto'
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
                            <ButtonOpenConfirm
                              style={{
                                padding: "10px 20px",
                                background: '#4CAF50',
                              }}
                              onClick={() => handleAlterarStatusPedido(pedido.id, 'finalizado')}
                            >
                              Finalizar Pedido
                            </ButtonOpenConfirm>
                            <ButtonOpenCancel
                              onClick={() => toggleMesa('cancelar', pedido.id)}
                              style={{ padding: '8px' }}>
                              Cancelar pedido
                            </ButtonOpenCancel>
                          </Order>
                        ))
                    )
                  }
                </Orders>
              </OrdersContainer> */}
            </GarcomWrapper>
          ) : (
            <>
              <p>Nenhum pedido aguardando aprovação.</p>
            </>
          )}
        </GarcomContainer>
      </GarcomPage>

      {/*Modal*/}
      {/* {isMesaOpen && (
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
      )} */}
    </>
  );
}
