"use client";

import { SupaContext } from "@/Context";
import { useContext, useEffect } from "react";
import Cookies from 'js-cookie';

export default function Cozinha() {
  const { contextPedidos, contextFuncionarios, updatePedido } = useContext(SupaContext);

  const handleAlterarStatusPedido = (pedidoId: number, status: string) => {
    const email = Cookies.get('email_func');
    const funcionario = contextFuncionarios.find((funcionario) => funcionario.email === email);

    if (!funcionario) {
      console.error("Usuário não logado.");
      return;
    }

    updatePedido(pedidoId, funcionario.id, status);
  };

  useEffect(() => {
    console.log(contextPedidos)
  }, [contextPedidos]);

  return (
    <div className="p-2">
      <h1>Cozinha</h1>
      <p>Aqui serão exibidos os pedidos em fila, em andamento e prontos.</p>
      <div className="w-full max-w-4xl">
        {contextPedidos.length > 0 ? (
          <>
            <div className="mb-3 p-2 border-2 border-yellow-500">
              <h3>Em fila</h3>
              {
                contextPedidos
                  .filter((pedido) => pedido.status === 'em_fila')
                  .map((pedido) => (
                    <div
                      key={pedido.id}
                      className="p-4 rounded shadow-md mb-4"
                    >
                      <p><strong>ID:</strong> {pedido.id}</p>
                      <p><strong>Mesa:</strong> {pedido.mesa}</p>
                      <p><strong>Status:</strong> {pedido.status}</p>
                      <p><strong>Aproved:</strong> {pedido.aproved_by}</p>
                      <p><strong>Client ID:</strong> {pedido.cliente_id}</p>
                      <p><strong>Client ID:</strong> {pedido.status}</p>
                      <button
                        className="bg-blue-500 text-black px-4 py-2 rounded mt-2"
                        onClick={() => handleAlterarStatusPedido(pedido.id, 'em_andamento')}
                      >
                        Pedido em andamento
                      </button>
                    </div>
                  ))
              }
            </div>
            <div className="mb-3 p-2 border-2 border-blue-500">
              <h3>Em andamento</h3>
              {
                contextPedidos
                  .filter((pedido) => pedido.status === 'em_andamento')
                  .map((pedido) => (
                    <div
                      key={pedido.id}
                      className="p-4 rounded shadow-md mb-4"
                    >
                      <p><strong>ID:</strong> {pedido.id}</p>
                      <p><strong>Mesa:</strong> {pedido.mesa}</p>
                      <p><strong>Status:</strong> {pedido.status}</p>
                      <p><strong>Aproved:</strong> {pedido.aproved_by}</p>
                      <p><strong>Client ID:</strong> {pedido.cliente_id}</p>
                      <p><strong>Client ID:</strong> {pedido.status}</p>
                      <button
                        className="bg-blue-500 text-black px-4 py-2 rounded mt-2"
                        onClick={() => handleAlterarStatusPedido(pedido.id, 'pronto')}
                      >
                        Pedido pronto
                      </button>
                    </div>
                  ))
              }
            </div>
            <div className="mb-3 p-2 border-2 border-green-500">
              <h3>Prontos</h3>
              {
                contextPedidos
                  .filter((pedido) => pedido.status === 'pronto')
                  .map((pedido) => (
                    <div
                      key={pedido.id}
                      className="p-4 rounded shadow-md mb-4"
                    >
                      <p><strong>ID:</strong> {pedido.id}</p>
                      <p><strong>Mesa:</strong> {pedido.mesa}</p>
                      <p><strong>Status:</strong> {pedido.status}</p>
                      <p><strong>Aproved:</strong> {pedido.aproved_by}</p>
                      <p><strong>Client ID:</strong> {pedido.cliente_id}</p>
                      <p><strong>Client ID:</strong> {pedido.status}</p>
                      <button
                        className="bg-blue-500 text-black px-4 py-2 rounded mt-2"
                        onClick={() => handleAlterarStatusPedido(pedido.id, 'encerrado')}
                      >
                        Encerrar pedido
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

        )
        }
      </div >
    </div >
  );
}
