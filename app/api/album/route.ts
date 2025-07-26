import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request){
  try{
    const { userId, title, tags, coverUrl } = await req.json()

    if(!title){
      return NextResponse.json({ error: 'Missing title' }, { status: 400 })
    }

    if(!userId){
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
    }

    const album = await prisma.album.create({
      data: {
        userId,
        title,
        tags,
        coverUrl
      }
    })

    return NextResponse.json(
      {
        success: true,
        album: {
          id: album.id,
          title: album.title,
          tags: album.tags,
          coverUrl: album.coverUrl
        }
      },
      { status: 201 }
    )
  } 
  catch (error){
    console.error('Error creating new album:', error)
    return NextResponse.json({ error: 'Server error creating new album' }, { status: 500 })
  }
}

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if(!userId){
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
    }

    const albums = await prisma.album.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, albums }, { status: 200 })
  }
  catch(error){
    console.error('Error getting all albums: ', error)
    return NextResponse.json({ error: 'Server error getting all albums' }, { status: 500 })
  }
}
