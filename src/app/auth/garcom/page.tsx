"use client";

import { SupaContext } from "@/Context";
import { useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { TypeItemPedido, TypePedido } from "@/Types/types";
import NavbarComponent from "@/Components/Navbar";
import { Container, GarcomContainer, GarcomPage, GarcomWrapper } from "./styles";
import PedidosEItens from "@/Components/PedidosEItens";

interface Solicitacao {
  mesaId: string;
  timestamp: number;
}

export default function Garcom() {
  const { contextPedidos, contextFuncionarios } = useContext(SupaContext);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [pedidoItens, setPedidoItens] = useState<{ [key: number]: TypeItemPedido[] }>({});

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
    <Container>
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
              
              <PedidosEItens
                status="pronto"
                contextPedidos={contextPedidos}
                pedidoItens={pedidoItens}
                isGarcom={true}
              />
            </GarcomWrapper>
          ) : (
            <>
              <p>Nenhum pedido aguardando aprovação.</p>
            </>
          )}
        </GarcomContainer>
      </GarcomPage>

    </Container>
  );
}
