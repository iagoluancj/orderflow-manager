import React, { useContext, useEffect, useRef, useState } from 'react';
import { ButtonOpenCancel, ButtonOpenConfirm, ContainerItensQT, ContainerMesaOpen, DropdownMenu, ItensQT, MenuButton, NavBar, NavButton, NavButtonMesa, NavButtonOrder, NavLink, NavLinks, NavLogo, NavMenu } from './styles';
import { LuLogOut } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import logo from '../../assets/logo.png'
import Image from 'next/image';
import { FaOpencart, FaShoppingBasket } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import { CartItem, TypePedido } from '@/Types/types';
import Cookies from "js-cookie";
import { SupaContext } from '@/Context';
import { toast } from 'react-toastify';
import { MdOutlineTableBar } from 'react-icons/md';

interface NavbarProps {
    message: string;
    cartQt?: number;
}

const NavbarComponent: React.FC<NavbarProps> = ({ message, cartQt }) => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrderOpen, setIsOrderOpen] = useState(false);
    const [isMesaOpen, setIsMesaOpen] = useState(false);
   
    const { cart, contextPedidos, updateCartItem, clearCart } = useContext(SupaContext);
    const [novaMesa, setNovaMesa] = useState(Cookies.get("mesa") || "");
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleOrder = () => setIsOrderOpen(!isOrderOpen);
    const toggleMesa = () => setIsMesaOpen(!isMesaOpen);
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleAlterMesa = () => {
        if (!novaMesa) {
            toast.error("Por favor, insira um número de mesa válido.");
            return;
        }

        Cookies.set("mesa", novaMesa);
        localStorage.setItem("mesa", novaMesa);
        setIsMesaOpen(!isMesaOpen)
        toast.success(`Alterado para mesa ${novaMesa}`);
    };

    const handleFinalizarPedido = async () => {
        const mesa = Cookies.get("mesa");
        const user_id = Cookies.get('user_id'); 

        if (!user_id) {
            toast.success('Cliente não autenticado. Faça login novamente.');
            return;
        }

        const pedidoPayload = {
            cliente_id: user_id,
            mesa,
            itens: cart.map(item => ({
                produto_id: item.id,
                quantidade: item.quantidade,
                observacao: item.observacao || null,
            })),
        };

        try {
            const response = await fetch('/api/pedidos/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidoPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao finalizar pedido:', errorData.message);
                alert('Erro ao finalizar o pedido. Tente novamente.');
                return;
            }

            const data = await response.json();
            console.log('Pedido criado com sucesso:', data);
            toast.success('Pedido criado com sucesso!');

            clearCart();
            setIsCartOpen(false);
        } catch (error) {
            console.error('Erro ao enviar pedido:', error);
            alert('Erro ao processar o pedido. Tente novamente.');
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    const handleObservacaoChange = (id: number, value: string) => {
        updateCartItem(id, { observacao: value });
    };

    const handleLogout = () => {
        localStorage.removeItem('userSession');
        localStorage.clear();

        document.cookie.split(';').forEach((cookie) => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        });

        router.push('/login');
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <>
            <NavBar>
                <NavLogo>
                    <Image src={logo} alt='Logo Order Flow'></Image>
                </NavLogo>
                <NavLinks>
                    <NavLink>{message}</NavLink>
                </NavLinks>
                <NavMenu>
                    <ContainerItensQT onClick={toggleCart}>
                        <FaOpencart size={30} />
                        <ItensQT>{cartQt}</ItensQT>
                    </ContainerItensQT>

                    <MenuButton onClick={toggleMenu}>
                        <IoMdMenu size={25} />
                    </MenuButton>

                    {isMenuOpen && (
                        <DropdownMenu ref={menuRef}>
                            <NavButtonOrder onClick={toggleOrder}>
                                Seus pedidos
                                <FaShoppingBasket size={25} />
                            </NavButtonOrder>
                            <NavButtonMesa onClick={toggleMesa}>
                                Alterar mesa
                                <MdOutlineTableBar size={25} />
                            </NavButtonMesa>
                            <NavButton onClick={handleLogout}>
                                Sair <LuLogOut size={25} />
                            </NavButton>
                        </DropdownMenu>
                    )}
                </NavMenu>
            </NavBar>
            {isCartOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#3F3F3F',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '95%',
                            maxWidth: '500px',
                            textAlign: 'center',
                        }}
                    >
                        <h2>Seu carrinho</h2>

                        <div>
                            {cart.length > 0 ? (
                                cart.map((item: CartItem) => (
                                    <div key={item.id}>
                                        <p>{item.nome}</p>
                                        <p>{`Quantidade: ${item.quantidade}`}</p>
                                        <p>{`Preço Total: R$ ${(item.quantidade * item.preco).toFixed(2)}`}</p>
                                        <input
                                            value={item.observacao || ''} 
                                            placeholder="Adicione uma observação"
                                            onChange={e => handleObservacaoChange(item.id, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                color: '#000',
                                                marginTop: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                            }}
                                        />                                    </div>
                                ))
                            ) : (
                                <p>O carrinho está vazio</p>
                            )}
                            {cart.length > 0 && (
                                <ButtonOpenConfirm
                                    onClick={handleFinalizarPedido}
                                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px' }}
                                >
                                    Finalizar Pedido
                                </ButtonOpenConfirm>
                            )}
                        </div>
                        <ButtonOpenCancel onClick={toggleCart} style={{ marginTop: '20px', padding: '10px 20px' }}>
                            Fechar
                        </ButtonOpenCancel>
                    </div>
                </div>
            )}
            {isOrderOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <ContainerMesaOpen
                        style={{
                            padding: '20px',
                            borderRadius: '8px',
                            width: '95%',
                            maxWidth: '500px',
                            textAlign: 'center',
                        }}
                    >
                        <h2>Seus pedidos</h2>

                        <div>
                            {contextPedidos.filter(pedido => pedido.cliente_id === Cookies.get('user_id')).length > 0 ? (
                                <>
                                    <div className='flex justify-center items-center overflow-auto mb-3 p-2 border-2 border-yellow-500'>
                                        <h3>Pedidos em fila</h3>
                                        {
                                            contextPedidos
                                                .filter(
                                                    pedido =>
                                                        pedido.status === 'em_fila' &&
                                                        pedido.cliente_id === Cookies.get('user_id')
                                                )
                                                .map((pedido: TypePedido) => (
                                                    <div key={pedido.id}>
                                                        <p>{pedido.id}</p>
                                                        <p>{`Mesa: ${pedido.mesa}`}</p>
                                                        <p>{`Status: ${pedido.status}`}</p>
                                                    </div>
                                                ))
                                        }
                                    </div>
                                    <div
                                        className="flex justify-center flex-row items-center overflow-y-auto max-h-64 mb-3 p-2 border-2 border-blue-500"
                                    >
                                        <h3>Pedidos em andamento</h3>
                                        {
                                            contextPedidos
                                                .filter(
                                                    pedido =>
                                                        pedido.status === 'em_andamento' &&
                                                        pedido.cliente_id === Cookies.get('user_id')
                                                )
                                                .map((pedido: TypePedido) => (
                                                    <div key={pedido.id}>
                                                        <p>{pedido.id}</p>
                                                        <p>{`Mesa: ${pedido.mesa}`}</p>
                                                        <p>{`Status: ${pedido.status}`}</p>
                                                    </div>
                                                ))
                                        }
                                    </div>
                                    <div className='flex justify-center items-center overflow-auto mb-3 p-2 border-2 border-green-500'>
                                        <h3>Pedidos prontos</h3>
                                        {
                                            contextPedidos
                                                .filter(
                                                    pedido =>
                                                        pedido.status === 'pronto' &&
                                                        pedido.cliente_id === Cookies.get('user_id')
                                                )
                                                .map((pedido: TypePedido) => (
                                                    <div key={pedido.id}>
                                                        <p>{pedido.id}</p>
                                                        <p>{`Mesa: ${pedido.mesa}`}</p>
                                                        <p>{`Status: ${pedido.status}`}</p>
                                                    </div>
                                                ))
                                        }
                                    </div>
                                </>
                            ) : (
                                <p>Você não possui pedidos</p>
                            )}
                        </div>

                        <ButtonOpenCancel onClick={toggleOrder} style={{ marginTop: '20px', padding: '10px 20px' }}>
                            Fechar
                        </ButtonOpenCancel>
                    </ContainerMesaOpen>
                </div>
            )}
            {isMesaOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <ContainerMesaOpen                    >
                        <h2>Mesa Atual: {novaMesa || "Não definida"}</h2>
                        <input
                            type="number"
                            placeholder="Digite o número da nova mesa"
                            className="border rounded p-2 mt-2 w-full"
                            value={novaMesa}
                            onChange={(e) => setNovaMesa(e.target.value)}
                        />

                        <ButtonOpenConfirm
                            onClick={handleAlterMesa}
                            style={{
                                marginTop: "1rem",
                                padding: "10px 20px",
                                background: '#4CAF50',
                            }}
                        >
                            Alterar mesa
                        </ButtonOpenConfirm>
                        <ButtonOpenCancel
                            onClick={toggleMesa}
                            style={{
                                padding: "10px 20px",
                            }}
                        >
                            Cancelar
                        </ButtonOpenCancel>
                    </ContainerMesaOpen>
                </div>
            )}
        </>
    );
};

export default NavbarComponent;