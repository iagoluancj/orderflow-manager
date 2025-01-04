"use client";

import { supabase } from "@/services/supabase";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CartItem, Produto, TypeAssociacoes, TypeCliente, TypeCozinha, TypeFuncionario, TypeItemPedido, TypePedido, TypeProduto } from "@/Types/types";
import { createContext, ReactNode, useEffect, useState } from "react";

type SupaProviderProps = {
    children: ReactNode;
};

type SupaContextType = {
    contextAssociacoes : TypeAssociacoes[];

    contextClient: TypeCliente[];
    contextPedidos: TypePedido[];
    contextItensPedido: TypeItemPedido[];
    contextFuncionarios: TypeFuncionario[];
    updateCliente: (clienteData: TypeCliente) => void;
    updatePedido: (pedidoId: number, userId: number, status: string) => void;
    cart: CartItem[];
    addItemToCart: (item: Produto) => void;
    removeItemFromCart: (itemId: number) => void;
    updateCartItem: (id: number, updatedFields: Partial<CartItem>) => void;
    clearCart: () => void;
};

export const SupaContext = createContext<SupaContextType>({
    contextAssociacoes : [],

    contextClient: [],
    contextPedidos: [],
    contextItensPedido: [],
    contextFuncionarios: [],
    updateCliente: () => { },
    updatePedido: () => { },
    cart: [],
    addItemToCart: () => { },
    removeItemFromCart: () => { },
    updateCartItem: () => { },
    clearCart: () => { }
});

const SupaProvider: React.FC<SupaProviderProps> = ({ children }) => {
    const [associacoes, setAssociacoes] = useState<TypeAssociacoes[]>([]);

    const [clientes, setClientes] = useState<TypeCliente[]>([]);
    const [pedidos, setPedidos] = useState<TypePedido[]>([]);
    const [itensPedido, setItensPedido] = useState<TypeItemPedido[]>([]); //Essa não é a melhor forma, a melhor forma é buscar o pedido por id. 
    const [funcionarios, setFuncionarios] = useState<TypeFuncionario[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    const updatePedido = async (pedidoId: number, userId: number, status: string) => {
        try {
            const { data, error } = await supabase
                .from('pedidos')
                .update({
                    aproved_by: userId,
                    status: status,
                })
                .eq('id', pedidoId);

            if (error) {
                // toast.error('Erro ao aprovar o pedido.');
                console.error('Erro ao atualizar pedido:', error);
            } else {
                // toast.success('Pedido aprovado com sucesso!');
                console.log('Pedido atualizado com sucesso:', data);
            }
        } catch (error) {
            // toast.error('Erro ao se conectar ao servidor.');
            console.error('Erro ao atualizar pedido:', error);
        }
    };

    const updateCliente = async (clienteData: TypeCliente) => {
        const { id, email, ...fieldsToUpdate } = clienteData;

        try {
            const { data: existingEmail, error: emailError } = await supabase
                .from('clientes')
                .select('id')
                .eq('email', email)
                .single();

            if (emailError) {
                console.error('Erro ao verificar e-mail existente:', emailError);
            }

            if (existingEmail && existingEmail.id !== id) {
                return { success: false, message: `E-mail já está em uso por outro cliente.` };
            }

            const { data, error } = await supabase
                .from('clientes')
                .update({ email, ...fieldsToUpdate })
                .eq('id', id);

            if (error) {
                console.error('Erro ao atualizar o cliente:', error);
                return { success: false, message: 'Erro ao tentar atualizar o cliente.' };
            } else {
                console.log('Cliente editado com sucesso.');
                return { success: true, message: 'Cliente atualizado com sucesso.', data };
            }

        } catch (error) {
            console.error('Erro inesperado:', error);
            return { success: false, message: 'Ocorreu um erro inesperado ao atualizar o cliente.' };
        }
    };

    const addItemToCart = (item: Produto) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === item.id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantidade: 1 }];
        });
    };

    const removeItemFromCart = (itemId: number) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i.id === itemId);
            if (existingItem?.quantidade === 1) {
                return prevCart.filter((i) => i.id !== itemId);
            }
            return prevCart.map((i) =>
                i.id === itemId ? { ...i, quantidade: i.quantidade - 1 } : i
            );
        });
    };

    const updateCartItem = (id: number, updatedFields: Partial<CartItem>) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, ...updatedFields } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    useEffect(() => {
        const getAllAssociacoes = async () => {
            const { data: associacoesData } = await supabase
                .from('associacoesmesas')
                .select('*')
                .order('id')
                .returns<TypeAssociacoes[]>();

            return { associacoesData };
        };

        const getAllClientes = async () => {
            const { data: clienteData } = await supabase
                .from('clientes')
                .select('*')
                .order('id')
                .returns<TypeCliente[]>();

            return { clienteData };
        };

        const getAllFunc = async () => {
            const { data: funcData } = await supabase
                .from('funcionarios')
                .select('*')
                .order('id')
                .returns<TypeFuncionario[]>();

            return { funcData };
        };

        const getAllPedidos = async () => {
            const { data: pedidosData } = await supabase
                .from('pedidos')
                .select('*')
                .order('id', { ascending: true })
                .returns<TypePedido[]>();

            return { pedidosData };
        };

        const getAllItensPedido = async () => {
            const { data: itensPedidoData } = await supabase
                .from('itenspedido')
                .select('*')
                .order('id', { ascending: true })
                .returns<TypeItemPedido[]>();

            return { itensPedidoData };
        };

        (async () => {
            const { associacoesData } = await getAllAssociacoes();
            setAssociacoes(associacoesData || []);

            const { clienteData } = await getAllClientes();
            setClientes(clienteData || []);

            const { funcData } = await getAllFunc();
            setFuncionarios(funcData || []);

            const { pedidosData } = await getAllPedidos();
            setPedidos(pedidosData || []);

            const { itensPedidoData } = await getAllItensPedido();
            setItensPedido(itensPedidoData || []);
        })();

        const associacoesChannel = supabase
        .channel('associacoesmesas-db-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'associacoesmesas',
            },
            (payload) => {
                console.log('Change received for associacoes:', payload);
                getAllAssociacoes().then(({ associacoesData }) => setAssociacoes(associacoesData || []));
            }
        )
        .subscribe();

        const clientesChannel = supabase
            .channel('clientes-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'clientes',
                },
                (payload) => {
                    console.log('Change received for clientes:', payload);
                    getAllClientes().then(({ clienteData }) => setClientes(clienteData || []));
                }
            )
            .subscribe();

        const funcChannel = supabase
            .channel('funcionarios-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'funcionarios',
                },
                (payload) => {
                    console.log('Change received for funcionarios:', payload);
                    getAllFunc().then(({ funcData }) => setFuncionarios(funcData || []));
                }
            )
            .subscribe();

        const pedidoChannel = supabase
            .channel('pedidos-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'pedidos',
                },
                (payload) => {
                    console.log('Change received for funcionarios:', payload);
                    getAllPedidos().then(({ pedidosData }) => setPedidos(pedidosData || []));
                }
            )
            .subscribe();

        const itensPedidoChannel = supabase
            .channel('itenspedido-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'itenspedido',
                },
                (payload) => {
                    console.log('Change received for funcionarios:', payload);
                    getAllItensPedido().then(({ itensPedidoData }) => setItensPedido(itensPedidoData || []));
                }
            )
            .subscribe();

        return () => {
            clientesChannel.unsubscribe();
            associacoesChannel.unsubscribe();
            funcChannel.unsubscribe();
            pedidoChannel.unsubscribe();
            itensPedidoChannel.unsubscribe();
        };
    }, []);

    return (
        <SupaContext.Provider
            value={{
                contextClient: clientes,
                contextPedidos: pedidos,
                contextAssociacoes: associacoes,
                contextItensPedido: itensPedido,
                contextFuncionarios: funcionarios,
                cart,
                updatePedido,
                updateCliente,
                updateCartItem,
                addItemToCart,
                removeItemFromCart,
                clearCart,
            }}
        >
            {children}
        </SupaContext.Provider>
    );
};

export default SupaProvider
