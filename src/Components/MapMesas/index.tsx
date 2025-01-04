"use client"

import { SupaContext } from "@/Context";
import { useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import restaurant from '../../assets/mesa.png'
import { FaChair, FaCheck } from "react-icons/fa";
import { MdOutlineEventBusy, MdOutlineReportProblem, MdTouchApp } from "react-icons/md";
import { TypeMesa } from "@/Types/types";
import { ButtonCallWaiter, ButtonProsseguir, ChairSection, Container, DivContainer, NameTable, TableContainer, Tables } from "./styles";
import { FcRotateToPortrait } from "react-icons/fc";
import { LuCalendarCheck2 } from "react-icons/lu";
import { ButtonOpenCancel, ButtonOpenConfirm, CartOpen, CartOpenContainer } from "../Navbar/styles";
import { Title } from "../Cardapio/styles";
import { IoMdClose } from "react-icons/io";

export default function MapMesas({ isGarcom }: { isGarcom?: boolean }) {
    const [selectedTable, setSelectedTable] = useState<{ id: number, name: string; capacity: number; } | null>(null);
    const [confirmMesa, setConfirmMesa] = useState(false);
    const [mesas, setMesas] = useState<{ id: number; capacity: number; style: React.CSSProperties, name: string }[]>([]);
    const { contextAssociacoes } = useContext(SupaContext);
    const [loading, setLoading] = useState(false);
    const userId = Cookies.get('user_id');

    const toggleConfirmMesa = () => {
        if (selectedTable) {
            setConfirmMesa(!confirmMesa);
        } else {
            toast.info('Selecione uma mesa para prosseguir!');
        }
    }


    const handleTableClick = (mesa: { id: number; name: string; capacity: number; style: React.CSSProperties; }) => {
        setSelectedTable({
            id: mesa.id,
            name: mesa.name,
            capacity: mesa.capacity,
        });
    };
    const handleProsseguir = async () => {
        const mesaAssociadaAtiva = contextAssociacoes.some(
            (assoc) => assoc.usuario_id === userId && !assoc.fim_ocupacao
        );

        if (mesaAssociadaAtiva) {
            toast.error('Você já está associado a uma mesa. Por favor, finalize a ocupação atual antes de selecionar outra.');
            return;
        }

        try {
            await fetch('/api/associacao-mesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: userId, mesa_id: selectedTable?.id, inicio_ocupacao: new Date().toISOString() }),
            });

            Cookies.set("mesa", String(selectedTable?.id), { expires: 2 });
            toast.success('Mesa selecionada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar associação:', error);
            toast.error('Erro ao associar-se a mesa.');
        } finally {
            setConfirmMesa(!confirmMesa);
        }
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
        const fetchMesas = async () => {
            try {
                const responseMesas = await fetch('/api/mesas');
                const mesasResult = await responseMesas.json();
                if (responseMesas.ok) {
                    // Adiciona as posições fixas às mesas
                    const mesasComPosicao = mesasResult.mesas.map((mesa: TypeMesa) => {
                        let positionStyle = {};
                        switch (mesa.id) {
                            case 1:
                                positionStyle = { top: '13%', left: '6.5%', width: '10%', height: '39%' };
                                break;
                            case 2:
                                positionStyle = { top: '60%', left: '6.5%', width: '10%', height: '33%' };
                                break;
                            case 3:
                                positionStyle = { top: '10%', left: '21%', width: '15%', height: '24%' };
                                break;
                            case 4:
                                positionStyle = { top: '6%', left: '37.5%', width: '12%', height: '20%' };
                                break;
                            case 5:
                                positionStyle = { top: '5.5%', left: '51.2%', width: '12%', height: '21%' };
                                break;
                            case 6:
                                positionStyle = { top: '40%', left: '21.2%', width: '15%', height: '25%' };
                                break;
                            case 7:
                                positionStyle = { top: '71.5%', left: '21.5%', width: '15%', height: '24%' };
                                break;
                            case 8:
                                positionStyle = { top: '74%', left: '43.5%', width: '15%', height: '23%' };
                                break;
                            case 9:
                                positionStyle = { top: '71%', left: '64.5%', width: '15%', height: '24%' };
                                break;
                            case 10:
                                positionStyle = { top: '31%', left: '39.5%', width: '23%', height: '41%' };
                                break;
                            case 11:
                                positionStyle = { top: '40%', left: '66%', width: '15%', height: '23%' };
                                break;
                            case 12:
                                positionStyle = { top: '10%', left: '65%', width: '15%', height: '23%' };
                                break;
                            case 13:
                                positionStyle = { top: '13%', left: '84.5%', width: '10%', height: '39%' };
                                break;
                            case 14:
                                positionStyle = { top: '60.5%', left: '84.5%', width: '10%', height: '32.5%' };
                                break;
                            default:
                                positionStyle = { top: '0%', left: '0%', width: '10%', height: '19%' };
                        }

                        const associacoesMesa = contextAssociacoes
                            .filter((assoc) => assoc.mesa_id === mesa.id);

                        let associacao;
                        if (associacoesMesa.length > 0) {
                            associacao = associacoesMesa.sort((a, b) =>
                                new Date(b.inicio_ocupacao).getTime() - new Date(a.inicio_ocupacao).getTime())[0]; // Pega a última associação
                        }
                        let status = 'livre';
                        if (associacao) {
                            if (associacao.inicio_ocupacao && !associacao.fim_ocupacao) {
                                status = 'ocupada';
                            } else if (associacao.inicio_ocupacao && associacao.fim_ocupacao) {
                                status = 'recém-liberada';
                            }
                        }

                        // Define a cor inicial com base no status da mesa
                        let backgroundColor;

                        if (associacao) {
                            const agora = new Date();
                            const fimOcupacao = associacao.fim_ocupacao ? new Date(associacao.fim_ocupacao) : null;

                            if (associacao.inicio_ocupacao && !associacao.fim_ocupacao) {
                                status = 'ocupada';
                            } else if (
                                associacao.inicio_ocupacao &&
                                fimOcupacao &&
                                (agora.getTime() - fimOcupacao.getTime()) <= 2 * 60 * 60 * 1000
                            ) {
                                status = 'recém-liberada';
                            }
                        }

                        switch (status) {
                            case 'livre':
                                backgroundColor = '#15ff0050';
                                break;
                            case 'ocupada':
                                backgroundColor = '#ff000050';
                                break;
                            case 'recém-liberada':
                                backgroundColor = '#ffa50050';
                                break;
                            default:
                                backgroundColor = '#ccc';
                        }

                        return { ...mesa, style: { ...positionStyle, backgroundColor } };
                    });

                    setMesas(mesasComPosicao);
                }
            } catch (error) {
                console.error('Erro ao conectar ao servidor:', error);
            }
        };

        fetchMesas(); // Chama a busca de mesas uma vez

    }, [contextAssociacoes]); // Executa apenas uma vez ao carregar

    return (
        <>
            <Container>
                <h1>Olá, userNameCookies!</h1>
                <p>Escolha a mesa ideal para você e seus convidados!</p>
                <DivContainer>
                    <p><MdTouchApp />
                        Toque ou clique na mesa para selecioná-la.</p>
                    <TableContainer>

                        <Tables>
                            <img src={restaurant.src} alt="Restaurant Tables" />
                            {mesas.map((mesa) => (
                                <div
                                    key={mesa.id}
                                    className="table-area"
                                    onClick={() => {
                                        if (mesa.style.backgroundColor !== '#ff000050') {
                                            handleTableClick(mesa);
                                        } else {
                                            toast.info("Essa mesa está ocupada no momento.");
                                        }
                                    }} style={{
                                        // Agora vou colocar o seguinte, de acordo com a cor do bakcgroup, o coursor, a transform, tudo, será desabilitado.
                                        ...mesa.style,
                                        backgroundColor: selectedTable?.id === mesa.id ? '#0000FF50' : mesa.style.backgroundColor, // Destacar mesa selecionada ou manter o status de ocupação
                                        borderRadius: '10px',
                                        border: selectedTable?.id === mesa.id ? '1px solid blue' : '1px solid gray',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '30px',
                                        transform: selectedTable?.id === mesa.id ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                >
                                    <span>
                                        <NameTable>
                                            {mesa.name}<br />
                                            <ChairSection>
                                                <FaChair />
                                                {mesa.capacity}
                                            </ChairSection>
                                        </NameTable>
                                    </span>
                                </div>
                            ))}
                        </Tables>
                    </TableContainer>
                    {/* Compreendo que isso pode gerar certa 'confusão mental' no usuário, pois ele poderá 
                    se perguntar: 'Por que existem mesas amarelas?'. No entanto, deixarei dessa forma 
                    para observar qual será o comportamento exato em produção, já prevendo que, 
                    provavelmente, essa função dos recém-liberados ficará restrita ao garçom. */}
                    <p>

                        Mesas disponíveis estão destacadas em <strong><LuCalendarCheck2 />
                            verde</strong> e <strong>Amarelo</strong>, ocupadas em <strong>vermelho <MdOutlineEventBusy /></strong>, e sua seleção aparecerá em <strong>azul</strong>.</p>

                    <p><FcRotateToPortrait /> Gire o celular para visular melhor as mesas e seus locais no restaurante</p>
                </DivContainer>
            </Container>

            <ButtonProsseguir
                onClick={toggleConfirmMesa}
                style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px' }}
            >
                Prosseguir
            </ButtonProsseguir>
            <ButtonCallWaiter onClick={callWaiter} disabled={loading}>
                <MdOutlineReportProblem size={25} />
                Problemas ao selecionar a mesa? Chame o garçom.
            </ButtonCallWaiter>

            {confirmMesa && (
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
                                fontSize: '1.2rem',
                                textAlign: 'center',
                            }}
                        // id e capacity
                        >{`Você selecionou a mesa #${selectedTable?.id} para ${selectedTable?.capacity} pessoas. Deseja continuar?`}</Title>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                            }}
                        >
                            <ButtonOpenConfirm
                                onClick={() => { handleProsseguir() }}

                                style={{
                                    padding: "10px 20px",
                                    background: '#4CAF50',
                                }}
                            >
                                <FaCheck />

                                Confirmar
                            </ButtonOpenConfirm>
                            <ButtonOpenCancel
                                onClick={() => toggleConfirmMesa()}
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
        </>
    );
}
