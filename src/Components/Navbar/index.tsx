import React, { useContext, useEffect, useRef, useState } from 'react';
import { ButtonOpenCancel, ButtonOpenConfirm, CartOpen, CartOpenContainer, ContainerItensQT, DropdownMenu, InputNewMesa, ItensQT, MenuButton, NavBar, NavButton, NavButtonMesa, NavButtonOrder, NavLink, NavLinks, NavLogo, NavMenu } from './styles';
import { LuLogOut } from 'react-icons/lu';
import { usePathname, useRouter } from 'next/navigation';
import logo from '../../assets/logo.png'
import Image from 'next/image';
import { FaOpencart, FaShoppingBasket } from 'react-icons/fa';
import { IoIosAdd, IoIosRemove, IoMdMenu } from 'react-icons/io';
import { CartItem, TypeItemPedido, TypePedido } from '@/Types/types';
import Cookies from "js-cookie";
import { SupaContext } from '@/Context';
import { toast } from 'react-toastify';
import { MdAttachMoney, MdOutlineTableBar } from 'react-icons/md';
import { MenuItem, MenuItemDescription, MenuItemDetails, MenuItemImage, MenuItemPrice, MenuItemQuantity, MenuItemQuantityContainer, MenuItemTitle, SpanAdd, Title } from '../Cardapio/styles';


import PedidosEItens from '../PedidosEItens';
import { imageMap } from '../Cardapio/Produtos/images';


interface NavbarProps {
    message: string;
    cartQt?: number;
    isGarcom?: boolean;
    deleteAll?: boolean;
}



const NavbarComponent: React.FC<NavbarProps> = ({ message, cartQt = 0, isGarcom, deleteAll }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGarcomCardapioPage, setIsGarcomCardapioPage] = useState(false);
    const [isGarcomPedidosPage, setIsGarcomPedidosPage] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrderOpen, setIsOrderOpen] = useState(false);
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [isMesaOpen, setIsMesaOpen] = useState(false);
    const [pedidoItens, setPedidoItens] = useState<{ [key: number]: TypeItemPedido[] }>({});
    const [garcomMesa, setGarcomMesa] = useState<number | ''>('');

    const [novaMesa, setNovaMesa] = useState(Cookies.get("mesa") || "");
    const email_func = Cookies.get('email_func');
    const currentMesa = Cookies.get("mesa") || "Não definida";

    const { cart, contextPedidos, updateCartItem, addItemToCart, removeItemFromCart, clearCart, contextFuncionarios } = useContext(SupaContext);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleOrder = () => setIsOrderOpen(!isOrderOpen);
    const toggleCreateOrder = () => setIsCreateOrderOpen(!isCreateOrderOpen);
    const toggleMesa = () => setIsMesaOpen(!isMesaOpen);
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };
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
                // console.error('Erro ao finalizar pedido:', errorData.message);
                toast.error('Erro ao finalizar o pedido. Tente novamente.');
                return { success: false, message: errorData.message };
            }

            if (response.ok) {
                const data = await response.json();
                // console.log('Pedido criado com sucesso:', data);
                toast.success('Pedido criado com sucesso!');
                return { success: true, message: data };
            }


            clearCart();
            setIsCartOpen(false);
        } catch (error) {
            console.error('Erro ao enviar pedido:', error);
            toast.error('Erro ao processar o pedido. Tente novamente.');
            return { success: false, message: error };

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

    const handleLogout = async () => {
        const userId = Cookies.get('user_id'); // Pega o ID do usuário atual do cookie

        try {
            await fetch('/api/associacao-mesas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: userId, fim_ocupacao: new Date().toISOString() }),
            });

            toast.success('Sessão encerrada e mesa liberada com sucesso.');
        } catch (error) {
            console.error('Erro ao atualizar fim_ocupacao:', error);
        } finally {
            localStorage.removeItem('userSession');
            localStorage.clear();

            document.cookie.split(';').forEach((cookie) => {
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            });

            router.push('/login');
        }
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
                    {deleteAll
                        ?
                        (<></>)
                        :
                        (
                            (cartQt > 0 && (isGarcom === false || cartQt !== undefined)) && (
                                <ContainerItensQT onClick={toggleCart}>
                                    <FaOpencart size={30} />
                                    <ItensQT>{cartQt}</ItensQT>
                                </ContainerItensQT>
                            )
                        )
                    }
                    <MenuButton onClick={toggleMenu}>
                        <IoMdMenu size={25} />
                    </MenuButton>
                    {

                        isMenuOpen && (
                            <DropdownMenu ref={menuRef}>
                                {
                                    deleteAll
                                        ? (<></>)
                                        : (
                                            <>
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
                                            </>
                                        )
                                }

                                <NavButton onClick={handleLogout}>
                                    Sair <LuLogOut size={25} />
                                </NavButton>
                            </DropdownMenu>
                        )
                    }
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
                                        <PedidosEItens
                                            status="em_fila"
                                            contextPedidos={contextPedidos}
                                            pedidoItens={pedidoItens}
                                        />
                                        <PedidosEItens
                                            status="em_andamento"
                                            contextPedidos={contextPedidos}
                                            pedidoItens={pedidoItens}
                                        />

                                        <PedidosEItens
                                            status="pronto"
                                            contextPedidos={contextPedidos}
                                            pedidoItens={pedidoItens}
                                        />
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