import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/User'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, trigger }) {
      // 최초 로그인 또는 세션 갱신 시 role 조회
      if ((trigger === 'signIn' || trigger === 'update' || !token.role) && token.email) {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: token.email }).lean() as { role?: string } | null
          if (dbUser?.role) token.role = dbUser.role
        } catch {
          // DB 미연결 시 role 없이 진행
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub
        if (token.role) session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
