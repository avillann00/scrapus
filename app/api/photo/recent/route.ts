import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request){
  try{
    const { userId } = await req.json()

    if(!userId){
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
    }

    const photos = await prisma.photo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return NextResponse.json({ success: true, photos }, { status: 200 })
  }
  catch(error){
    console.error('Error fetching photos:', error)
    return NextResponse.json({ error: 'Server error all photos' }, { status: 500 })
  }
}
