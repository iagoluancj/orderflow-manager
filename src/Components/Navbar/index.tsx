import React, { useContext, useEffect, useRef, useState } from 'react';
import { ButtonOpenCancel, ButtonOpenConfirm, CartOpen, CartOpenContainer, ContainerItensQT, DropdownMenu, InputNewMesa, ItensQT, LiOrderItens, MenuButton, NavBar, NavButton, NavButtonMesa, NavButtonOrder, NavLink, NavLinks, NavLogo, NavMenu, Order, OrderFila, Orders, OrdersContainer, OrdersContainerAndamento, OrdersContainerFila, OrdersContainerProntos, PedidoId, TitleOrder, ViewOrders } from './styles';
import { LuLogOut } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import logo from '../../assets/logo.png'
import Image from 'next/image';
import { FaOpencart, FaShoppingBasket } from 'react-icons/fa';
import { IoIosAdd, IoIosRemove, IoMdMenu } from 'react-icons/io';
import { CartItem, TypeItemPedido, TypePedido } from '@/Types/types';
import Cookies from "js-cookie";
import { SupaContext } from '@/Context';
import { toast } from 'react-toastify';
import { MdOutlineTableBar } from 'react-icons/md';
import { MenuItem, MenuItemDescription, MenuItemDetails, MenuItemImage, MenuItemPrice, MenuItemQuantity, MenuItemQuantityContainer, MenuItemTitle, SpanAdd, Title } from '../Cardapio/styles';

import itemSeila from '../../assets/item.png'


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
    const [pedidoItens, setPedidoItens] = useState<{ [key: number]: TypeItemPedido[] }>({});
    const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

    const { cart, contextPedidos, updateCartItem, addItemToCart, removeItemFromCart, clearCart } = useContext(SupaContext);
    const [novaMesa, setNovaMesa] = useState(Cookies.get("mesa") || "");
    const currentMesa = Cookies.get("mesa") || "Não definida";
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleOrder = () => setIsOrderOpen(!isOrderOpen);
    const toggleMesa = () => setIsMesaOpen(!isMesaOpen);
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };
    const toggleOrderItems = (pedidoId: number) => {
        console.log(pedidoItens)
        if (expandedOrders.includes(pedidoId)) {
            setExpandedOrders(expandedOrders.filter(id => id !== pedidoId));
        } else {
            setExpandedOrders([...expandedOrders, pedidoId]);
        }
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

    // const fechItensPedido = async (pedido_id: number) => {

    //     try {
    //         const response = await fetch(`/api/itens-pedidos?pedido_id=${pedido_id}`, {
    //             method: 'GET',
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             console.error('Erro ao buscar itens do pedido:', errorData.message);
    //             toast.error('Erro ao buscar itens do pedido. Tente novamente.');
    //             return;
    //         }

    //         const data = await response.json();
    //         console.log('Itens do pedido buscado com sucesso:', data);

    //         clearCart();
    //         setIsCartOpen(false);
    //     } catch (error) {
    //         console.error('Erro buscar itens do pedido:', error);
    //     }
    // };

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
        const fetchAllItensPedidos = async () => {
            const pedidosComItens: { [key: number]: TypeItemPedido[] } = {};

            await Promise.all(
                contextPedidos
                    .filter(pedido =>
                        // pedido.status === 'aguard_aprovacao' &&
                        pedido.cliente_id === Cookies.get('user_id')
                    )
                    .map(async (pedido: TypePedido) => {
                        const response = await fetch(`/api/itens-pedidos?pedido_id=${pedido.id}`, { method: 'GET' });
                        if (response.ok) {
                            const data = await response.json();
                            pedidosComItens[pedido.id] = data.itens;
                        }
                    })
            );

            setPedidoItens(pedidosComItens);
        };

        fetchAllItensPedidos();

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isMenuOpen, contextPedidos]);

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
                <CartOpenContainer
                >
                    <CartOpen
                        style={{
                            backgroundColor: '#3F3F3F',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '95%',
                            maxWidth: '500px',
                        }}
                    >
                        <Title> <FaOpencart /> Seu carrinho</Title>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            {cart.length > 0 ? (
                                cart.map((item: CartItem) => {
                                    const cartItem = cart.find((cartItem) => cartItem.id === item.id);

                                    return (
                                        <MenuItem key={item.id}>
                                            <MenuItemImage><Image src={itemSeila} alt={`Image item ${item.nome}`}></Image></MenuItemImage>
                                            <MenuItemDetails>
                                                <MenuItemTitle>{item.nome}</MenuItemTitle>
                                                <MenuItemDescription>Hambúrguer com duas camadas suculentas de carne.</MenuItemDescription>
                                                <MenuItemQuantityContainer>
                                                    <MenuItemQuantity    > <SpanAdd onClick={() => removeItemFromCart(item.id)}> <IoIosRemove />   </SpanAdd>{cartItem ? cartItem.quantidade.toString().padStart(2, '0') : '00'} uni. <SpanAdd onClick={() => addItemToCart(item)}> <IoIosAdd /> </SpanAdd></MenuItemQuantity>
                                                    <MenuItemPrice>
                                                        Total <br /> R$ {cartItem
                                                            ? (Number(item.preco) * cartItem.quantidade).toFixed(2).replace('.', ',')
                                                            : Number(item.preco).toFixed(2).replace('.', ',')}
                                                    </MenuItemPrice>
                                                </MenuItemQuantityContainer>
                                                <input
                                                    value={item.observacao || ''}
                                                    placeholder="Observações"
                                                    onChange={e => handleObservacaoChange(item.id, e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        color: '#000',
                                                        marginTop: '8px',
                                                        borderRadius: '4px',
                                                        outline: '1px solid #f1a94e',
                                                        border: '1px solid #ccc',
                                                    }}
                                                />
                                            </MenuItemDetails>
                                        </MenuItem>
                                    )
                                })
                            ) : (
                                <>
                                    <p>O carrinho está vazio</p>

                                    {/* SKELLETON a ser montado 
                                    <MenuItem>
                                        <MenuItemImage><Image src={itemSeila} alt={`Image item skeleton`}></Image></MenuItemImage>
                                        <MenuItemDetails>
                                            <MenuItemTitle>N/A</MenuItemTitle>
                                            <MenuItemDescription>Lorém ipsum skeleton</MenuItemDescription>
                                            <MenuItemQuantityContainer>
                                                <MenuItemQuantity    > <SpanAdd> <IoIosRemove />   </SpanAdd>00 uni. <SpanAdd> <IoIosAdd /> </SpanAdd></MenuItemQuantity>
                                                <MenuItemPrice>
                                                    R$ 00,00 Total
                                                </MenuItemPrice>
                                            </MenuItemQuantityContainer>
                                            <input
                                                placeholder="Observações"
                                                disabled
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    color: '#000',
                                                    marginTop: '8px',
                                                    borderRadius: '4px',
                                                    outline: '1px solid #f1a94e',
                                                    border: '1px solid #ccc',
                                                }}
                                            />
                                        </MenuItemDetails>
                                    </MenuItem> */}
                                </>

                            )
                            }
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                            }}
                        >
                            <span>
                                Total: R$ {cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0).toFixed(2).replace('.', ',')}
                            </span>
                            <ButtonOpenConfirm
                                onClick={handleFinalizarPedido}
                                disabled={cart.length === 0 ? true : false}
                                style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px' }}
                            >
                                Finalizar Pedido
                            </ButtonOpenConfirm>

                            <ButtonOpenCancel onClick={toggleCart} style={{ padding: '8px' }}>
                                Fechar
                            </ButtonOpenCancel>
                        </div>
                    </CartOpen>
                </CartOpenContainer>
            )}
            {isOrderOpen && (
                <CartOpenContainer
                >
                    <CartOpen
                        style={{
                            backgroundColor: '#3F3F3F',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '100%',
                            maxWidth: '500px',
                        }}
                    >
                        <Title>
                            <FaShoppingBasket size={25} />
                            Seus pedidos
                        </Title>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: '1rem',
                            }}
                        >
                            {contextPedidos.filter(pedido => pedido.cliente_id === Cookies.get('user_id')).length > 0 ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        gap: '1rem',
                                    }}
                                >
                                    <OrdersContainer>
                                        <TitleOrder>Pedidos aguardando aprovação</TitleOrder>
                                        <Orders>
                                            {
                                                contextPedidos
                                                    .filter(
                                                        pedido =>
                                                            pedido.status === 'aguard_aprovacao' &&
                                                            pedido.cliente_id === Cookies.get('user_id')
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
                                                            pedido.status === 'aguard_aprovacao' &&
                                                            pedido.cliente_id === Cookies.get('user_id')
                                                    )
                                                        .map((pedido: TypePedido) => (

                                                            // Talvez organizar em tabela ou grid seja a melhor opção, analisar.
                                                            <Order key={pedido.id}>
                                                                <PedidoId><strong>Pedido:</strong> {`${pedido.id}`}</PedidoId>
                                                                <p><strong>Sua mesa: </strong>{`${pedido.mesa}`}</p>
                                                                {/* <p><strong>Status: </strong>{`${pedido.status ? 'Aprovação garçom.' : 'Problema com o status.'}`}</p> */}
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
                                                                                    {/* <p>
                                                                            {item.produto_preco !== undefined
                                                                                ? `Subtotal: R$${(item.quantidade * item.produto_preco).toFixed(2)}`
                                                                                : 'Subtotal: R$ER.ROR'}
                                                                        </p> */}
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
                                                            </Order>
                                                        ))
                                                )
                                            }
                                        </Orders>
                                    </OrdersContainer>
                                    <OrdersContainerFila>
                                        <TitleOrder>Pedidos em fila</TitleOrder>
                                        <Orders>
                                            {
                                                contextPedidos
                                                    .filter(
                                                        pedido =>
                                                            pedido.status === 'em_fila' &&
                                                            pedido.cliente_id === Cookies.get('user_id')
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
                                                            pedido.status === 'em_fila' &&
                                                            pedido.cliente_id === Cookies.get('user_id')
                                                    )
                                                        .map((pedido: TypePedido) => (
                                                            <OrderFila key={pedido.id}>
                                                                <PedidoId><strong>Pedido:</strong> {`${pedido.id}`}</PedidoId>
                                                                <p><strong>Sua mesa: </strong>{`${pedido.mesa}`}</p>
                                                                {/* <p><strong>Status: </strong>{`${pedido.status ? 'Pedido em fila.' : 'Problema com o status.'}`}</p> */}
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
                                                                                flexDirection: 'row',
                                                                                alignItems: 'start',
                                                                                justifyContent: 'start',
                                                                                flexWrap: 'wrap',
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
                                                                                    {/* <p>
                                                                                {item.produto_preco !== undefined
                                                                                    ? `Subtotal: R$${(item.quantidade * item.produto_preco).toFixed(2)}`
                                                                                    : 'Subtotal: R$ER.ROR'}
                                                                            </p> */}
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
                                                            </OrderFila>
                                                        ))
                                                )
                                            }
                                        </Orders>
                                    </OrdersContainerFila>
                                    <OrdersContainerAndamento>
                                        <TitleOrder>Pedidos em andamento</TitleOrder>
                                        <Orders>
                                            {
                                                contextPedidos
                                                    .filter(
                                                        pedido =>
                                                            pedido.status === 'em_andamento' &&
                                                            pedido.cliente_id === Cookies.get('user_id')
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
                                                            pedido.status === 'em_andamento' &&
                                                            pedido.cliente_id === Cookies.get('user_id')
                                                    )
                                                        .map((pedido: TypePedido) => (
                                                            <OrderFila key={pedido.id}>
                                                                <PedidoId><strong>Pedido:</strong> {`${pedido.id}`}</PedidoId>
                                                                <p><strong>Sua mesa: </strong>{`${pedido.mesa}`}</p>
                                                                {/* <p><strong>Status: </strong>{`${pedido.status ? 'Pedido em fila' : 'Problema com o status.'}`}</p> */}
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
                                                                                flexDirection: 'row',
                                                                                alignItems: 'start',
                                                                                justifyContent: 'start',
                                                                                flexWrap: 'wrap',
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
                                                                                    {/* <p>
                                                                                {item.produto_preco !== undefined
                                                                                    ? `Subtotal: R$${(item.quantidade * item.produto_preco).toFixed(2)}`
                                                                                    : 'Subtotal: R$ER.ROR'}
                                                                            </p> */}
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
                                                            </OrderFila>
                                                        ))
                                                )
                                            }
                                        </Orders>
                                    </OrdersContainerAndamento>
                                    <OrdersContainerProntos
                                    >
                                        <TitleOrder>Pedidos prontos</TitleOrder>
                                        <Orders>
                                            {
                                                contextPedidos
                                                    .filter(
                                                        pedido =>
                                                            pedido.status === 'pronto' &&
                                                            pedido.cliente_id === Cookies.get('user_id')
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
                                                            pedido.status === 'pronto' &&
                                                            pedido.cliente_id === Cookies.get('user_id')
                                                    )
                                                        .map((pedido: TypePedido) => (
                                                            <OrderFila key={pedido.id}>
                                                                <PedidoId><strong>Pedido:</strong> {`${pedido.id}`}</PedidoId>
                                                                <p><strong>Sua mesa: </strong>{`${pedido.mesa}`}</p>
                                                                {/* <p><strong>Status: </strong>{`${pedido.status ? 'Pedido em fila' : 'Problema com o status.'}`}</p> */}
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
                                                                                flexDirection: 'row',
                                                                                alignItems: 'start',
                                                                                justifyContent: 'start',
                                                                                flexWrap: 'wrap',
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
                                                                                    {/* <p>
                                                                            {item.produto_preco !== undefined
                                                                                ? `Subtotal: R$${(item.quantidade * item.produto_preco).toFixed(2)}`
                                                                                : 'Subtotal: R$ER.ROR'}
                                                                        </p> */}
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
                                                            </OrderFila>
                                                        ))
                                                )
                                            }
                                        </Orders>
                                    </OrdersContainerProntos>
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center' }}>Você não possui pedidos.</p>
                            )}
                        </div>

                        <ButtonOpenCancel onClick={toggleOrder} style={{ marginTop: '20px', padding: '10px 20px' }}>
                            Fechar
                        </ButtonOpenCancel>
                    </CartOpen>
                </CartOpenContainer>
            )}
            {isMesaOpen && (
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
                        <Title><MdOutlineTableBar size={30} /> Sua mesa</Title>

                        <h2>Mesa Atual: {currentMesa || "Não definida"}</h2>
                        <InputNewMesa
                            type="number"
                            placeholder="Digite o número da nova mesa"
                            className="border rounded p-2 mt-2 w-full"
                            onChange={(e) => setNovaMesa(e.target.value)}
                        />
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
                                onClick={handleAlterMesa}
                                style={{
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
                        </div>
                    </CartOpen>
                </CartOpenContainer>
            )}
        </>
    );
};

export default NavbarComponent;