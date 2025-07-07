import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: Request){
  try{
    
    const { email, names, password } = await req.json()

    if(!email || !password || names.length < 1){
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if(existingUser){
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        names,
        password: hashedPassword
      }
    })

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, names: user.names } }, { status: 201 })
  }
  catch(error){
    console.error('Error registering user: ', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
