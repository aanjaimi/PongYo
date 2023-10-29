import { type NextRequest, NextResponse } from 'next/server';
import { env } from './env.mjs';

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token');

    if (!token) throw new Error();

    const resp = await fetch(
      `${env.NEXT_PUBLIC_DOCKER_BACKEND_ORIGIN}/api/users/@me`,
      {
        headers: {
          Cookie: `auth-token=${token.value}`,
        },
      },
    );

    if (!resp.ok) throw new Error();
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/chat', '/game', '/profile', '/friend'],
};
