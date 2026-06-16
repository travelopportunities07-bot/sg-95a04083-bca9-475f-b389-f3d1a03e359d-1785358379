import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes qui nécessitent une authentification
const protectedRoutes = [
  '/tasks',
  '/documents',
  '/activity',
  '/profile',
  '/settings',
  '/notifications',
  '/hr',
  '/hr/employees',
  '/hr/reminders',
  '/hr/settings',
  '/hr/activity',
  '/hr/invite',
  '/workflows',
];

// Routes réservées aux HR managers
const hrRoutes = [
  '/hr',
  '/hr/employees',
  '/hr/reminders',
  '/hr/settings',
  '/hr/activity',
  '/hr/invite',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Récupérer le token d'authentification depuis les cookies
  const token = request.cookies.get('sb-access-token')?.value;
  
  if (!token) {
    // Pas de token, rediriger vers login avec redirect
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si c'est une route HR, vérifier le rôle (à implémenter avec le payload du token si nécessaire)
  // Pour l'instant, on laisse passer si authentifié
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth|api).*)',
  ],
};