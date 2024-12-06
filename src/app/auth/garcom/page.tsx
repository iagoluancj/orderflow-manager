"use client";

import { SupaContext } from "@/Context";
import { useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';

interface Solicitacao {
  mesaId: string;
  timestamp: number;
}

export default function Garcom() {
  const { contextPedidos, contextFuncionarios, updatePedido } = useContext(SupaContext);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  const handleAlterarStatusPedido = (pedidoId: number, status: string) => {
    const email = Cookies.get('email_func');
    const funcionario = contextFuncionarios.find((funcionario) => funcionario.email === email);

    if (!funcionario) {
      console.error("Funcionário não logado.");
      return;
    }

    updatePedido(pedidoId, funcionario.id, status);
  };

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
    const interval = setInterval(fetchSolicitacoes, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-2">
      <h1>Garçom</h1>
      <p>Aqui serão exibidos os pedidos para aprovação.</p>
      <div className="w-full max-w-4xl">
        {contextPedidos.length > 0 ? (
          <>
            <div className="mb-3 p-2 border-2 border-yellow-500">
              <h3>Aguardando aprovação</h3>
              {
                contextPedidos
                  .filter((pedido) => pedido.status === 'aguard_aprovacao')
                  .map((pedido) => (
                    <div
                      key={pedido.id}
                      className="p-4 rounded shadow-md mb-4 "
                    >
                      <p><strong>ID:</strong> {pedido.id}</p>
                      <p><strong>Mesa:</strong> {pedido.mesa}</p>
                      <p><strong>Status:</strong> {pedido.status}</p>
                      <p><strong>Aproved:</strong> {pedido.aproved_by}</p>
                      <p><strong>Client ID:</strong> {pedido.cliente_id}</p>
                      <p><strong>Client ID:</strong> {pedido.status}</p>
                      <button
                        className="bg-blue-500 text-black px-4 py-2 rounded mt-2"
                        onClick={() => handleAlterarStatusPedido(pedido.id, 'em_fila')}
                      >
                        Aprovar Pedido
                      </button>
                    </div>
                  ))
              }
            </div>
            <div className="p-2 border-2 border-green-500">
              <h3>Pedidos prontos</h3>
              {
                contextPedidos
                  .filter((pedido) => pedido.status === 'pronto')
                  .map((pedido) => (
                    <div
                      key={pedido.id}
                      className="p-4 rounded shadow-md mb-4 "
                    >
                      <p><strong>ID:</strong> {pedido.id}</p>
                      <p><strong>Mesa:</strong> {pedido.mesa}</p>
                      <p><strong>Status:</strong> {pedido.status}</p>
                      <p><strong>Aproved:</strong> {pedido.aproved_by}</p>
                      <p><strong>Client ID:</strong> {pedido.cliente_id}</p>
                      <p><strong>Client ID:</strong> {pedido.status}</p>
                      <button
                        className="bg-blue-500 text-black px-4 py-2 rounded mt-2"
                        onClick={() => handleAlterarStatusPedido(pedido.id, 'finalizado')}
                      >
                        Finalizar Pedido
                      </button>
                    </div>
                  ))
              }
            </div>
          </>
        ) : (
          <>
            <p>Nenhum pedido aguardando aprovação.</p>
          </>

        )}
      </div>
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
          <p></p>
        )}
      </div>
    </div>
  );
}
