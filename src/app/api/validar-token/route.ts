import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    
    if (!token) {
        return NextResponse.json(
            { message: 'Token ou email não fornecido.' },
            { status: 400 }
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if (decoded) {
            const response = NextResponse.redirect(new URL('/login', request.url));

            response.cookies.set('access_token', token, {
                path: '/',
                maxAge: 60 * 60 * 24,
                secure: process.env.NODE_ENV === 'production',
                httpOnly: false,
            });

            if (typeof decoded !== 'string' && 'email' in decoded) {
                response.cookies.set('email_func', decoded.email, {
                    path: '/',
                    maxAge: 60 * 60 * 24, // 24 horas
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: false,
                });
            }

            return response;
        } else {
            console.log('Token inválido')
            return NextResponse.redirect(new URL('/login', request.url));
        }

    } catch (error) {
        console.error('Erro ao validar o token:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}
