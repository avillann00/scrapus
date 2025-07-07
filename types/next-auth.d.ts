import NextAuth from 'next-auth'

declare module 'next-auth'{
  interface Session{
    user: {
      id: string
      names?: string[] | null
      email?: string | null
    }
  }

  interface User{
    id: string
  }
}

declare module 'next-auth/jwt'{
  interface JWT{
    id: string
    names? : string[] | null
    email: string | null
  }
}
