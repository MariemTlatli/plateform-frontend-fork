import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated, getUserRole } from '@/utils/Auth'

const protectedRoutes = {
  member: ['/member', '/member/assignments', '/member/sessions'],
  instructor: [
    '/instructor/assignments',
    '/instructor/sessions',
    '/instructor/create',
    '/instructor/chats',
    '/instructor/responses',
    '/instructor/showMembers'
  ],
  admin: [
    '/superAdmin/home',
    '/superAdmin/departments',
    '/superAdmin/Instrutors'
  ]
}

export default async function middleware(req: NextRequest) {
  const isAuth = isAuthenticated(req)
  const userRole = isAuth ? await getUserRole(req) : null
  const { pathname } = req.nextUrl

  if (isAuth) {
    if (protectedRoutes.member.includes(pathname) && userRole !== 'member') {
      return NextResponse.redirect(new URL('/not-found', req.nextUrl.origin))
    }
    if (
      protectedRoutes.instructor.includes(pathname) &&
      userRole !== 'instructor'
    ) {
      return NextResponse.redirect(new URL('/not-found', req.nextUrl.origin))
    }
    if (protectedRoutes.admin.includes(pathname) && userRole !== 'superAdmin') {
      return NextResponse.redirect(new URL('/not-found', req.nextUrl.origin))
    }
  }

  return NextResponse.next()
}

