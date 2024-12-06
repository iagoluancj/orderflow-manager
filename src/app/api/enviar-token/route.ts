import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json(
            { message: 'O campo email é obrigatório.' },
            { status: 400 }
        );
    }

    try {
        const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        const validationUrl = `${process.env.FRONTEND_URL}/api/validar-token?token=${token}&email=${email}`;


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: 'Order Flow Manager <orderflow.manager.support@gmail.com>',
            to: email,
            subject: 'Token de acesso - Your Company | Order Flow Manager',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <p style="font-size: 16px;">
                Você solicitou acesso ao Order Flow Manager.
              </p>
              <p style="font-size: 16px;">
                Para concluir o processo de login e validar seu acesso, clique no link abaixo:
              </p>
              <p>
                <a href="${validationUrl}" style="background-color: #f1a94e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Validar Acesso</a>
              </p>
              <p style="font-size: 14px; color: #777;">
                Se você não solicitou este acesso, por favor ignore este email.
              </p>
              <br>
              <p style="font-size: 16px;">Atenciosamente,</p>
              <p style="font-size: 16px; font-weight: bold;">Equipe Order Flow Manager</p>
              <p style="font-size: 12px; font-style: italic; color: #777;">
                *Atenção: e-mails enviados de endereços diferentes de "orderflow.manager.support@gmail.com" não são oficiais e podem conter ameaças de segurança, como vírus ou tentativas de fraude.*
              </p>
            </div>
        `,
        };

        // Envio do e-mail
        await transporter.sendMail(mailOptions);

        console.log('E-mail enviado com sucesso para:', email);
        return NextResponse.json(
            { message: 'Token enviado por e-mail.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao enviar o token:', error);
        return NextResponse.json(
            { message: 'Erro ao enviar o token. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json(
            { message: 'Token não fornecido.' },
            { status: 400 }
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.json(
            { message: 'Token válido.', token_decoded: decoded },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao validar o token:', error);
        return NextResponse.json(
            { message: 'Token inválido ou expirado.' },
            { status: 401 }
        );
    }
}
