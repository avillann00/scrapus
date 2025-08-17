import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request){
  try{
    const { userId, title, albumId, photoUrl, tags, caption } = await req.json()

    if(!userId){
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }
    if(!title){
      return NextResponse.json({ error: 'Missing title' }, { status: 400 })
    }
    if(!photoUrl){
      return NextResponse.json({ error: 'Missing photo' }, { status: 400 })
    }
    if(!albumId){
      return NextResponse.json({ error: 'Missing album id' }, { status: 400 })
    }

    const photo = await prisma.photo.create({
      data: {
        userId,
        title,
        tags,
        albumId,
        photoUrl,
        caption
      }
    })

    return NextResponse.json({ success: true, photo: photo }, { status: 201 })
  }
  catch(error){
    console.error('Error creating photo:', error)
    return NextResponse.json({ error: 'Server error creating new photo' }, { status: 500 })
  }
}

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)

    const albumId = searchParams.get('albumId')

    const orderParam = searchParams.get('order')
    const order: 'asc' | 'desc' = orderParam === 'asc' ? 'asc' : 'desc'

    if(albumId){
      const page = parseInt(searchParams.get('page') ?? '1')
      const limit = parseInt(searchParams.get('limit') ?? '10')

      const offset = (page - 1) * limit

      const photos = await prisma.photo.findMany({
        where: { albumId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: order }
      })

      return NextResponse.json({ success: true, photos }, { status: 200 })
    }
    else{
      const userId = searchParams.get('userId')

      if(!userId){
        return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
      }

      const photos = await prisma.photo.findMany({
        where: { userId },
        orderBy: { createdAt: order }
      })

      return NextResponse.json({ success: true, photos }, { status: 200 })
    }
  }
  catch(error){
    console.error('Error getting all photos:', error)
    return NextResponse.json({ error: 'Server error getting all photos' }, { status: 500 })
  }
}
