import React, { useContext, useEffect, useRef, useState } from 'react';
import { ButtonOpenCancel, ButtonOpenConfirm, CartOpen, CartOpenContainer, ContainerItensQT, DropdownMenu, InputNewMesa, ItensQT, MenuButton, NavBar, NavButton, NavButtonMesa, NavButtonOrder, NavLink, NavLinks, NavLogo, NavMenu } from './styles';
import { LuLogOut } from 'react-icons/lu';
import { usePathname, useRouter } from 'next/navigation';
import logo from '../../assets/logo.png'
import Image, { StaticImageData } from 'next/image';
import { FaOpencart, FaShoppingBasket } from 'react-icons/fa';
import { IoIosAdd, IoIosRemove, IoMdMenu } from 'react-icons/io';
import { CartItem, TypeItemPedido, TypePedido } from '@/Types/types';
import Cookies from "js-cookie";
import { SupaContext } from '@/Context';
import { toast } from 'react-toastify';
import { MdAttachMoney, MdOutlineTableBar } from 'react-icons/md';
import { MenuItem, MenuItemDescription, MenuItemDetails, MenuItemImage, MenuItemPrice, MenuItemQuantity, MenuItemQuantityContainer, MenuItemTitle, SpanAdd, Title } from '../Cardapio/styles';

import itemHamburguer from '../../assets/item.jpg'
import itemPizza from '../../assets/pizza.jpg'
import itemSalada from '../../assets/salada.jpg'
import PedidosEItens from '../PedidosEItens';


interface NavbarProps {
    message: string;
    cartQt?: number;
    isGarcom?: boolean;
}

const imageMap: { [key: string]: StaticImageData } = {
    'Hamburguer': itemHamburguer,
    'Pizza Margherita': itemPizza,
    'Salada Caesar': itemSalada,
};

const NavbarComponent: React.FC<NavbarProps> = ({ message, cartQt = 0, isGarcom }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGarcomCardapioPage, setIsGarcomCardapioPage] = useState(false);
    const [isGarcomPedidosPage, setIsGarcomPedidosPage] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrderOpen, setIsOrderOpen] = useState(false);
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [isMesaOpen, setIsMesaOpen] = useState(false);
    const [pedidoItens, setPedidoItens] = useState<{ [key: number]: TypeItemPedido[] }>({});
    const [garcomMesa, setGarcomMesa] = useState<number | ''>('');

    const { cart, contextPedidos, updateCartItem, addItemToCart, removeItemFromCart, clearCart, contextFuncionarios } = useContext(SupaContext);
    const [novaMesa, setNovaMesa] = useState(Cookies.get("mesa") || "");
    const email_func = Cookies.get('email_func');
    const currentMesa = Cookies.get("mesa") || "Não definida";
    const menuRef = useRef<HTMLDivElement | null>(null);


    const toggleGarcomCardapioPage = () => {
        const newPageState = !isGarcomCardapioPage;
        setInterval(() => {
            setIsGarcomCardapioPage(newPageState)
        }, 2000);

        const nextRoute = newPageState ? 'http://localhost:3000/auth/garcom/cardapio' : 'http://localhost:3000/auth/garcom';
        router.push(nextRoute);
    }

    const toggleGarcomPedidosPage = () => {
        const newPageState = !isGarcomPedidosPage;
        setInterval(() => {
            setIsGarcomPedidosPage(newPageState)
        }, 2000);

        const nextRoute = newPageState ? 'http://localhost:3000/auth/garcom/pedidos' : 'http://localhost:3000/auth/garcom';
        router.push(nextRoute);
    }

    // const toggleGarcomCardapioPage = () => setIsGarcomCardapioPage(!isGarcomCardapioPage);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleOrder = () => setIsOrderOpen(!isOrderOpen);
    const toggleCreateOrder = () => setIsCreateOrderOpen(!isCreateOrderOpen);
    const toggleMesa = () => setIsMesaOpen(!isMesaOpen);
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    // const toggleOrderItems = (pedidoId: number) => {
    //     console.log(pedidoItens)
    //     if (expandedOrders.includes(pedidoId)) {
    //         setExpandedOrders(expandedOrders.filter(id => id !== pedidoId));
    //     } else {
    //         setExpandedOrders([...expandedOrders, pedidoId]);
    //     }
    // };

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
        const email_func = Cookies.get('email_func');

        const funcionario = email_func
            ? contextFuncionarios.find(funcionario => funcionario.email === email_func)
            : null;
        const isFuncionario = !!funcionario;

        if (!user_id && !isFuncionario) {
            toast.error('Cliente não autenticado. Faça login.');
            return;
        }

        const pedidoPayload = {
            cliente_id: isFuncionario ? undefined : user_id,
            func_id: isFuncionario ? funcionario.id : undefined,
            mesa: isFuncionario ? garcomMesa : mesa,
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
                toast.error('Erro ao finalizar o pedido. Tente novamente.');
                return;
            }

            const data = await response.json();
            console.log('Pedido criado com sucesso:', data);
            toast.success('Pedido criado com sucesso!');

            clearCart();
            setIsCartOpen(false);
        } catch (error) {
            console.error('Erro ao enviar pedido:', error);
            toast.error('Erro ao processar o pedido. Tente novamente.');
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

    const handleGarcomMesa = (mesa: number) => {
        setGarcomMesa(mesa)
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
        const isCurrentGarcomCardapio = pathname.includes('garcom/cardapio');
        setIsGarcomCardapioPage(isCurrentGarcomCardapio);

        const isCurrentGarcomPedidos = pathname.includes('garcom/pedidos');
        setIsGarcomPedidosPage(isCurrentGarcomPedidos);

        const fetchAllItensPedidos = async () => {
            // const pedidosComItens: { [key: number]: TypeItemPedido[] } = {};
            const cachedData = JSON.parse(localStorage.getItem('pedidosComItens') || '{}');

            const pedidosSemCache = contextPedidos.filter(
                pedido => pedido.cliente_id === Cookies.get('user_id') && !cachedData[pedido.id]
            );

            if (pedidosSemCache.length > 0) {
                const novosItens: { [key: number]: TypeItemPedido[] } = {};

                await Promise.all(
                    pedidosSemCache.map(async (pedido: TypePedido) => {
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

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isMenuOpen, contextPedidos, pathname]);

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
                    {
                        (cartQt > 0 && (isGarcom === false || cartQt !== undefined)) && (
                            <ContainerItensQT onClick={toggleCart}>
                                <FaOpencart size={30} />
                                <ItensQT>{cartQt}</ItensQT>
                            </ContainerItensQT>
                        )
                    }
                    <MenuButton onClick={toggleMenu}>
                        <IoMdMenu size={25} />
                    </MenuButton>

                    {isMenuOpen && (
                        <DropdownMenu ref={menuRef}>
                            {
                                isGarcom === true ? (
                                    <NavButtonOrder onClick={toggleGarcomCardapioPage}>
                                        {isGarcomCardapioPage ? 'Pedidos' : 'Fazer pedido'}
                                        <FaShoppingBasket size={25} />
                                    </NavButtonOrder>

                                ) : (
                                    <NavButtonOrder onClick={toggleOrder}>
                                        Seus pedidos
                                        <FaShoppingBasket size={25} />
                                    </NavButtonOrder>
                                )
                            }
                            {
                                isGarcom === true ? (
                                    <></>

                                ) : (
                                    <NavButtonMesa onClick={toggleMesa}>
                                        Alterar mesa
                                        <MdOutlineTableBar size={25} />
                                    </NavButtonMesa>
                                )
                            }
                            {
                                isGarcom === true ? (
                                    <NavButtonMesa onClick={toggleGarcomPedidosPage}>
                                        {isGarcomPedidosPage ? 'Pedidos' : 'Fechar contas'}
                                        <MdAttachMoney size={25} />
                                    </NavButtonMesa>
                                ) : (
                                    <>
                                    </>
                                )
                            }
                            <NavButton onClick={handleLogout}>
                                Sair <LuLogOut size={25} />
                            </NavButton>
                        </DropdownMenu>
                    )}
                </NavMenu>
            </NavBar>

            {/* Não necessário, já possui poucas linhas. */}
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
                                    const itemImage = imageMap[item.nome] || '';

                                    return (
                                        <MenuItem key={item.id}>
                                            <MenuItemImage><Image src={itemImage} alt={`Image item ${item.nome}`}></Image></MenuItemImage>
                                            <MenuItemDetails>
                                                <MenuItemTitle>{item.nome}</MenuItemTitle>
                                                <MenuItemDescription>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                </MenuItemDescription>
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
                        {
                            email_func ? (
                                <input
                                    placeholder="Insira a mesa do cliente: "
                                    value={garcomMesa || ''}
                                    onChange={e => handleGarcomMesa(Number(e.target.value))}
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
                            ) : (

                                <>
                                </>
                            )
                        }
                    </CartOpen>
                </CartOpenContainer>
            )}

            {/*Reutilização aplicada. */}
            {isOrderOpen && (
                <>
                    <CartOpenContainer
                    >
                        <CartOpen
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
                                        
                                        <PedidosEItens
                                            status="aguard_aprovacao"
                                            contextPedidos={contextPedidos}
                                            pedidoItens={pedidoItens}
                                        />
                                        {/* <OrdersContainer>
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

                                                                <Order key={pedido.id}>
                                                                    <PedidoId><strong>Pedido:</strong> {`${pedido.id}`}</PedidoId>
                                                                    <p><strong>Sua mesa: </strong>{`${pedido.mesa}`}</p>
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
                                        </OrdersContainer> */}
                                        <PedidosEItens
                                            status="em_fila"
                                            contextPedidos={contextPedidos}
                                            pedidoItens={pedidoItens}
                                        />
                                        {/* <OrdersContainerFila>
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
                                        </OrdersContainerFila> */}
                                        <PedidosEItens
                                            status="em_andamento"
                                            contextPedidos={contextPedidos}
                                            pedidoItens={pedidoItens}
                                        />
                                        {/* <OrdersContainerAndamento>
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
                                        </OrdersContainerAndamento> */}
                                        <PedidosEItens
                                            status="pronto"
                                            contextPedidos={contextPedidos}
                                            pedidoItens={pedidoItens}
                                        />
                                        {/* <OrdersContainerProntos
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
                                        </OrdersContainerProntos> */}
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
                </>
            )}

            {/* Não necessário, já possui poucas linhas. */}
            {isCreateOrderOpen && (
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
                                onClick={toggleCreateOrder}
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

            {/* Não necessário, já possui poucas linhas. */}
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