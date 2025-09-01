import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest){
  try{
    const { searchParams } = new URL(req.url)
    const songId = searchParams.get('songId')

    if(!songId){
      return NextResponse.json({ error: 'Missing song id' }, { status: 400 })
    }

    const song = await prisma.song.findUnique({
      where: { id: songId }
    })

    return NextResponse.json({ success: true, song }, { status: 200 })
  }
  catch(error){
    console.error('Server error getting song: ', error)
    return NextResponse.json({ error: 'Server error getting song' }, { status: 500 })
  }
}
