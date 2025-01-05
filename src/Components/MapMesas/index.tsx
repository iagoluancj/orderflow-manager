"use client"

import { SupaContext } from "@/Context";
import { useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import restaurant from '../../assets/mesa.png'
import { FaChair, FaCheck, FaRegQuestionCircle } from "react-icons/fa";
import { MdOutlineEventBusy, MdOutlineReportProblem, MdOutlineTableBar, MdTouchApp } from "react-icons/md";
import { TypeMesa } from "@/Types/types";
import { ButtonCallWaiter, ButtonDescriptionDuvida, ButtonProsseguir, ButtonsActionContainer, ChairSection, ConfirmMesa, ConfirmMesaContainer, Container, Description, DescriptionCores, DescriptionDuvida, DescriptionDuvidaContainer, DivContainer, FilterChairContainer, FindMesas, InputChair, NameTable, TableContainer, Tables } from "./styles";
import { LuCalendarCheck2 } from "react-icons/lu";
import { ButtonOpenCancel, ButtonOpenConfirm } from "../Navbar/styles";
import { Title } from "../Cardapio/styles";
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io";
import { showToast } from "@/lib/ToastProvider";

export default function MapMesas() {
    const [selectedTable, setSelectedTable] = useState<{ id: number, name: string; capacity: number; } | null>(null);
    const [confirmMesa, setConfirmMesa] = useState(false);
    const [filteredTablesCount, setFilteredTablesCount] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [filterCapacity, setFilterCapacity] = useState<number | null>(null);
    const [mesas, setMesas] = useState<{ id: number; capacity: number; style: React.CSSProperties, name: string }[]>([]);
    const { contextAssociacoes } = useContext(SupaContext);
    const [loading, setLoading] = useState(false);
    const userId = Cookies.get('user_id');
    const user = Cookies.get('user');
    const firstName = user ? user.split(' ')[0].charAt(0).toUpperCase() + user.split(' ')[0].slice(1).toLowerCase() : '';

    const toggleConfirmMesa = () => {
        if (selectedTable) {
            setConfirmMesa(!confirmMesa);
        } else {
            showToast("Selecione uma mesa para prosseguir!", "info");
        }
    }

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

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
            showToast("Você já está associado a uma mesa. Por favor, finalize a ocupação atual antes de selecionar outra.", "error");
            return;
        }

        try {
            await fetch('/api/associacao-mesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: userId, mesa_id: selectedTable?.id, inicio_ocupacao: new Date().toISOString() }),
            });

            Cookies.set("mesa", String(selectedTable?.id), { expires: 2 });
            showToast("Mesa selecionada com sucesso!.", "success");

        } catch (error) {
            console.error('Erro ao criar associação:', error);
            showToast("Erro ao associar-se a mesa.", "error");

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
                showToast("Garçom chamado, fique com o braço levantado para fácil identificação.", "info");
            } else {
                showToast("Erro ao chamar o garçom.", "error");
            }
        } catch (error) {
            console.error("Erro ao chamar o garçom:", error);
            showToast("Erro ao se conectar ao servidor.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value ? parseInt(event.target.value, 10) : null;
        setFilterCapacity(value);

        const count = mesas.filter((mesa) => {
            if (value === null) return false;
            return mesa.capacity >= value;
        }).length;

        // Atualiza a contagem de mesas filtradas
        setFilteredTablesCount(count);

        // Gerencia a mensagem de busca
        setHasSearched(value !== null);
    };

    // Função para determinar se a mesa atende ao filtro
    const isMesaHighlighted = (mesa: { capacity: number }) => {
        if (filterCapacity === null) return false;
        return mesa.capacity >= filterCapacity;
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
                                backgroundColor = '#15ff0050';  //Cor de 'recem-liberada original #ffa50050 
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
                <h1>Olá, {firstName}!</h1>
                <p>
                    <span>Escolha</span> <span>a</span> <span>mesa</span> <span>ideal</span> <span>para</span> <span>você</span> <span>e</span> <span>seus</span> <span>convidados!</span>
                </p>
                <DivContainer>
                    <FilterChairContainer>
                        <FaChair size={30} />
                        <InputChair
                            type="number"
                            id="capacity-filter"
                            placeholder="Quantas cadeiras deseja?"
                            onChange={handleFilterChange}
                        />
                        <FindMesas style={{ color: hasSearched ? '#ededed' : '#3f3f3f' }} >
                            <i>{hasSearched ? `${filteredTablesCount} mesas encontradas.` : ''}</i>
                        </FindMesas>
                    </FilterChairContainer>

                    <TableContainer>
                        <Tables>
                            <img src={restaurant.src} alt="Restaurant Tables" />
                            {mesas.map((mesa) => {
                                const isHighlighted = isMesaHighlighted(mesa);
                                const isOcupada = mesa.style.backgroundColor === '#ff000050';
                                const isSelecionada = selectedTable?.id === mesa.id;
                                return (
                                    <div
                                        key={mesa.id}
                                        className="table-area"
                                        onClick={() => {
                                            if (mesa.style.backgroundColor !== '#ff000050') {
                                                handleTableClick(mesa);
                                            } else {
                                                showToast("Essa mesa está ocupada no momento.", "info");
                                            }
                                        }} style={{
                                            // Agora vou colocar o seguinte, de acordo com a cor do bakcgroup, o coursor, a transform, tudo, será desabilitado.
                                            ...mesa.style,
                                            backgroundColor: isOcupada
                                                ? '#ff000050' // Preserva vermelho para mesas ocupadas
                                                : isSelecionada
                                                    ? '#0000FF80' // Azul para mesa selecionada
                                                    : isHighlighted
                                                        ? '#0000FF30' // Amarelo para destaque
                                                        : mesa.style.backgroundColor, // Padrão
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
                                                <ChairSection>
                                                    <MdOutlineTableBar size={20} />
                                                    {mesa.name}<br />
                                                </ChairSection>
                                                <ChairSection>
                                                    <FaChair />
                                                    {mesa.capacity}
                                                </ChairSection>
                                            </NameTable>
                                        </span>
                                    </div>
                                )
                            })}
                        </Tables>
                    </TableContainer>

                    <Description>
                        <MdTouchApp size={16} />
                        <span>
                            <i>
                                Toque na mesa para selecioná-la.
                            </i>
                        </span>
                    </Description>

                </DivContainer>

                <DescriptionDuvidaContainer>
                    <ButtonDescriptionDuvida onClick={toggleDescription} >
                        <span>
                            <FaRegQuestionCircle />
                            {!showDescription ? `Dúvidas sobre as cores?` : "Ocultar detalhes"}
                        </span>
                        {!showDescription ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </ButtonDescriptionDuvida>

                    {showDescription && (
                        <DescriptionDuvida>
                            <DescriptionCores>
                                <span>
                                    Mesas disponíveis estão destacadas em{" "}
                                    <strong style={{ color: "#15ff0050" }}>
                                        <LuCalendarCheck2 /> Verde
                                    </strong>
                                    , ocupadas em{" "}
                                    <strong style={{ color: "#ff000050" }}>
                                        <MdOutlineEventBusy /> Vermelho
                                    </strong>
                                    , e a mesa selecionada aparecerá em{" "}
                                    <strong style={{ color: "#0000FF50" }}> Azul</strong>.
                                </span>
                            </DescriptionCores>
                        </DescriptionDuvida>
                    )}
                </DescriptionDuvidaContainer>

            </Container >

            <ButtonProsseguir
                onClick={toggleConfirmMesa}
                style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px' }}
            >
                Concluir escolha
            </ButtonProsseguir>

            <ButtonCallWaiter onClick={callWaiter} disabled={loading}>
                <MdOutlineReportProblem size={25} />
                Precisa de ajuda?! Clique aqui.
            </ButtonCallWaiter>

            {
                confirmMesa && (
                    <ConfirmMesaContainer>
                        <ConfirmMesa>
                            <Title style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                                {`Você selecionou a mesa #${selectedTable?.id} para ${selectedTable?.capacity} pessoas. Deseja continuar?`}
                            </Title>
                            <ButtonsActionContainer>
                                <ButtonOpenConfirm
                                    onClick={() => { handleProsseguir() }}

                                    style={{
                                        padding: "10px 20px",
                                        background: '#4CAF50',
                                    }}
                                >
                                    <FaCheck />

                                    Sim
                                </ButtonOpenConfirm>
                                <ButtonOpenCancel
                                    onClick={() => toggleConfirmMesa()}
                                    style={{
                                        padding: "10px 20px",
                                    }}
                                >
                                    <IoMdClose />
                                    Não
                                </ButtonOpenCancel>
                            </ButtonsActionContainer>
                        </ConfirmMesa>
                    </ConfirmMesaContainer>
                )
            }
        </>
    );
}
