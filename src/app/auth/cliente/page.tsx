"use client"

import { SupaContext } from "@/Context";
import { useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import NavbarComponent from "@/Components/Navbar";
import Cardapio from "@/Components/Cardapio/page";
import MapMesas from "@/Components/MapMesas";
import { ClienteContainer } from "./styles";

export default function Cliente() {
  const { contextPedidos } = useContext(SupaContext);
  const [lastPedidoId, setLastPedidoId] = useState<number | null>(null);
  const [mesas, setMesas] = useState<{ id: number; capacity: number; style: React.CSSProperties, name: string }[]>([]);
  const { cart, contextAssociacoes } = useContext(SupaContext);
  const userId = Cookies.get('user_id');
  const mesa = Cookies.get('mesa');

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const responseMesas = await fetch('/api/mesas');
        const mesasResult = await responseMesas.json();
        if (responseMesas.ok) {
          setMesas(mesasResult);
        }
      } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
      }
    };

    fetchMesas(); // Chama a busca de mesas uma vez

  }, [contextAssociacoes]); // Executa apenas uma vez ao carregar

  useEffect(() => {
    if (!contextPedidos || contextPedidos.length === 0) return;

    const monitorPedidos = () => {
      const pedidosCliente = contextPedidos
        .filter((pedido) => pedido.cliente_id === userId && pedido.updated_at)
        .sort((a, b) => {
          const dateA = new Date(a.updated_at ?? 0).getTime();
          const dateB = new Date(b.updated_at ?? 0).getTime();
          return dateB - dateA;
        });

      const ultimoPedido = pedidosCliente[0];

      if (ultimoPedido && ultimoPedido.id !== lastPedidoId) {
        console.log("Último pedido atualizado:", ultimoPedido);
        setLastPedidoId(ultimoPedido.id);

        // Exibe toast com base no status do pedido
        switch (ultimoPedido.status) {
          case "pedido_negado":
            toast.info("Seu pedido foi negado pelo estabelecimento.");
            break;
          case "em_fila":
            toast.info("Seu pedido foi adicionado à fila!");
            break;
          case "em_andamento":
            toast.info("Seu pedido está sendo preparado!");
            break;
          case "pronto":
            toast.success("Seu pedido está pronto!");
            break;
          default:
            break;
        }
      }
    };

    monitorPedidos();
  }, [contextPedidos, userId, lastPedidoId]);

  return (
    <>
      {
        mesa ? (
          <>
            <NavbarComponent message='Cardápio' cartQt={cart.length} />
            <Cardapio />
          </>
        ) : (
          <ClienteContainer>
            <NavbarComponent message='Escolha sua mesa' cartQt={cart.length} deleteAll={true} />
            <h1>Bem-vindo ao [Nome do Restaurante]!</h1>
            <MapMesas isGarcom={false} />
          </ClienteContainer>
        )
      }
    </>
  );
}
