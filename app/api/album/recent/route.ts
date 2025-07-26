import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if(!userId){
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
    }

    const albums = await prisma.album.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    return NextResponse.json({ success: true, albums }, { status: 200 })
  }
  catch(error){
    console.error('Error getting all albums: ', error)
    return NextResponse.json({ error: 'Server error getting all albums' }, { status: 500 })
  }
}
