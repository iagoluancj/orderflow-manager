/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { TypeCliente } from '@/Types/types';
import { supabase } from '@/services/supabase';
import Cookies from 'js-cookie';


export async function POST(request: Request) {
    const clienteData: Omit<TypeCliente, 'id'> = await request.json();
    const { nome, email, telefone, created_at } = clienteData;
    const createdDate = new Date()

    try {
        const { data: existingCliente, error: checkError } = await supabase
            .from('clientes')
            .select('id, email, telefone')
            .or(`email.eq.${email},telefone.eq.${telefone}`);

        if (checkError) {
            console.error('Erro ao verificar cliente existente:', checkError);
            return NextResponse.json(
                { message: 'Erro ao verificar e-mail ou telefone do cliente.' },
                { status: 400 }
            );
        }

        if (existingCliente && existingCliente.length) {
            console.log('Cliente já cadastrado:', existingCliente);
            // Cookies.set("token", data.token, { expires: 1, sameSite: 'strict' }); a
            // Cookies.set("user", existingCliente, { expires: 1, sameSite: 'strict' });
            return NextResponse.json(
                { message: 'Usuário já cadastrado no sistema.', cliente: existingCliente[0] },
                { status: 202 } 
            );
        }

        const { data, error } = await supabase
            .from('clientes')
            .insert([{ nome, email, telefone, created_at: createdDate}])
            .select();

        if (error) {
            console.error('Erro ao criar o cliente:', error);
            return NextResponse.json(
                { message: 'Erro ao criar o cliente. Tente novamente.' },
                { status: 500 }
            );
        }

        if (data && data.length > 0) {
            console.log('Cliente criado com sucesso:', data[0]);
            return NextResponse.json(
                { message: 'Cliente criado com sucesso!', cliente: data[0] },
                { status: 201 } 
            );
        }
    } catch (error) {
        console.error('Erro no processo de criação do cliente:', error);
        return NextResponse.json(
            { message: 'Erro ao processar a criação do cliente. Tente novamente.' },
            { status: 500 }
        );
    }
}
