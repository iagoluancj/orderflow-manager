"use client";

import { SupaContext } from "@/Context";
import { useContext, useEffect, useState } from "react";
import PedidosEItens from "@/Components/PedidosEItens";
import { TypeItemPedido, TypePedido } from "@/Types/types";
import NavbarComponent from "@/Components/Navbar";

export default function Cozinha() {
  const { contextPedidos } = useContext(SupaContext);
  const [pedidoItens, setPedidoItens] = useState<{ [key: number]: TypeItemPedido[] }>({});

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

  }, [contextPedidos]);

  return (
    <>
      <NavbarComponent message='Cozinha' isGarcom={true} cartQt={undefined} />

      <div className="p-2">
        <h1>Cozinha</h1>
        <p>Aqui serão exibidos os pedidos em fila, em andamento e prontos.</p>
        <div className="w-full max-w-4xl">
          {contextPedidos.length > 0 ? (
            <>
              <PedidosEItens
                status="em_fila"
                contextPedidos={contextPedidos}
                pedidoItens={pedidoItens}
                isGarcom={true}
              />
              <PedidosEItens
                status="em_andamento"
                contextPedidos={contextPedidos}
                pedidoItens={pedidoItens}
                isGarcom={true}
              />
            </>
          ) : (
            <>
              <p>Nenhum pedido aguardando aprovação.</p>
            </>

          )
          }
        </div >
      </div >
    </>
  );
}
