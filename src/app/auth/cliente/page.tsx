"use client"

import { SupaContext } from "@/Context";
import { useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import NavbarComponent from "@/Components/Navbar";
import Cardapio from "@/Components/Cardapio/page";
import { ChoosingPadding, ChoosingTable, ConfirmButton, ContainerChoosingTable, Description, FailedChoosingTable, Title } from "./styles";

export default function Cliente() {
  const { contextPedidos } = useContext(SupaContext);
  const [lastPedidoId, setLastPedidoId] = useState<number | null>(null);
  const [novaMesa, setNovaMesa] = useState(Cookies.get("mesa") || ""); 
  const [loading, setLoading] = useState(false);
  const [mesa, setMesa] = useState(false)
  const userId = Cookies.get('user_id');

  const handleSetMesa = () => {
    if (!novaMesa) {
      toast.error("Por favor, insira um número de mesa válido.");
      return;
    }

    setMesa(true)
    Cookies.set("mesa", novaMesa);
    localStorage.setItem("mesa", novaMesa); 
    toast.success(`Você está na mesa ${novaMesa}, aproveite!`);
  };

  const callWaiter = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/waiter-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mesaId: 'Cliente com problemas para selecionar a mesa, procure o cliente de braço levantado.' }),
      });

      if (response.ok) {
        toast.info("Garçom chamado, fique com o braço levantado para fácil identificação.");
      } else {
        toast.error("Erro ao chamar o garçom.");
      }
    } catch (error) {
      console.error("Erro ao chamar o garçom:", error);
      toast.error("Erro ao se conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const mesaCookie = Cookies.get("mesa");
    const mesaLocal = localStorage.getItem("mesa");

    if (mesaCookie) {
      setMesa(true)
      setNovaMesa(mesaCookie);
    } else if (mesaLocal) {
      setNovaMesa(mesaLocal);
      Cookies.set("mesa", mesaLocal);
    }
  }, []);

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
          case "recusado":
            toast.info("Seu pedido foi recusado pelo estabelecimento.");
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
          <Cardapio />
        ) : (
          <ContainerChoosingTable>
            <NavbarComponent message="Defina sua mesa" />

            <ChoosingPadding>
              <ChoosingTable>
                <Title>É um prazer ter você conosco.</Title>
                <Description>
                  {/* Agora, nos diga, você está em qual mesa? */}
                  <br />
                  O número da mesa fica em X lugar.
                  <input type="number" maxLength={10} value={novaMesa} onChange={(e) => setNovaMesa(e.target.value)} placeholder="Informe o número da mesa aqui."/>
                </Description>
                {/* <InputComponent
                  label="Número da mesa"
                  maxLength={10} 
                  type="number"
                  name="mesa"
                  value={novaMesa} 
                  onChange={(e) => setNovaMesa(e.target.value)} 
                /> */}
                <ConfirmButton onClick={handleSetMesa}>
                  Confirmar mesa
                </ConfirmButton>
                {/* <Warning>
                  <i>Atenção ao selecionar sua mesa, caso esteja incorreta teremos problemas na entrega de pedido.</i>
                </Warning> */}
                <FailedChoosingTable>
                  <Description>
                    <button onClick={callWaiter} disabled={loading}>Problemas ao selecionar a mesa? Chame o garçom clicando aqui.</button>
                  </Description>
                  {/* <ButtonChamarGarcomMesa onClick={callWaiter} disabled={loading}>
                  {loading ? "Chamando..." : "Chamar Garçom"}
                </ButtonChamarGarcomMesa> */}
                </FailedChoosingTable>
              </ChoosingTable>
            </ChoosingPadding>
          </ContainerChoosingTable>
        )
      }
    </>
  );
}
