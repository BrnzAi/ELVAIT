import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic auth credentials for /md/* routes
const MD_AUTH = {
  username: 'dev',
  password: 'fjemba71'
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /md/* routes
  if (pathname.startsWith('/md')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Documentation"',
        },
      });
    }

    // Decode and verify credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== MD_AUTH.username || password !== MD_AUTH.password) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Documentation"',
        },
      });
    }

    // Redirect /md to /md/index.md
    if (pathname === '/md' || pathname === '/md/') {
      return NextResponse.redirect(new URL('/md/index.md', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/md', '/md/:path*'],
};
