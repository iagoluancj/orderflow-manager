import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidClient } from './lib/cacheClient';

const protectedRoutes = ['/auth'];

async function userAuth(token: string | undefined, email: string | undefined, baseUrl: string) {
  if (!token || !email) return false;

  try {
    const response = await fetch(`${baseUrl}/api/validate-token-intern?token=${token}&email=${email}`);

    if (response.status === 200) {
      return true;
    } else {
      return false; 
    }
  } catch (error) {
    console.error('Erro na validação do token:', error);
    return false; 
  }
}

export async function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;

  const accessToken = cookies.get('access_token')?.value;
  const email = cookies.get('email_func')?.value;
  const userId = cookies.get('user_id')?.value;
  const baseUrl = nextUrl.origin;

  if (nextUrl.pathname === '/auth/cliente/cart') {
    if (userId && isValidClient(userId)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (nextUrl.pathname === '/auth/cliente') {
    if (userId && isValidClient(userId)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  

  if (protectedRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    if (!(await userAuth(accessToken, email, baseUrl))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const validationResponse = await fetch(
      `${nextUrl.origin}/api/validar-token?token=${accessToken}&email=${email}`
    );

    if (validationResponse.status !== 200) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*'],
};
