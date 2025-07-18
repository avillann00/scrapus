import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request){
  try{
    const { userId, albumId, photoUrl, tags } = await req.json()

    if(!title){
      return NextResponse.json({ error: 'Missing title' }, { status: 400 })
    }

    if(!userId){
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
    }

    if(!photoUrl){
      return NextResponse.json({ error: 'Missing photo' }, { status: 400 })
    }

    const photo = await prisma.photo.create({
      data: {
        userId,
        title,
        tags,
        albumId,
        photoUrl
      }
    })

    return NextResponse({ success: true, photo: photo }, { status: 201 })
  }
  catch(error){
    console.error('Error creating photo:', error)
    return NextResponse.json({ error: 'Server error creating new photo' }, { status: 500 })
  }
}

export async function GET(req: Request){
  try{
    const { userId } = await req.json()

    if(!userId){
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
    }

    const photos = await prisma.photo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, photos }, { status: 200 })
  }
  catch(error){
    console.error('Error getting all photos:', error)
    return NextResponse.json({ error: 'Server error getting all photos' }, { status: 500 })
  }
}
