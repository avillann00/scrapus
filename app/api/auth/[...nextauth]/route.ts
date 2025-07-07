import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { compare } from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials){
        if(!credentials.email || !credentials.password){
          console.log('Email or password are not present')
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if(!user || !user.password){
          console.log(`User with email '${credentials.email}' does not exist`)
          return null
        }

        const isValid = await compare(credentials.password, user.password)
        if(!isValid){
          console.log('Incorrect password')
          return null
        }

        return user
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }){
      if(user){ 
        token.id = user.id
        token.names = user.names
        token.email = user.email
      }

      return token
    },
    async session({ session, token }){
      if(token){
        session.user.id = token.id
        session.user.names = token.names
        session.user.email = token.email
      }

      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }
