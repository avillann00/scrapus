import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type Song = {
  id: string
  name: string
  preview_url: string | null
  uri: string
  album: {
    id: string
    name: string
    images: { url: string }[]
  }
  artists: {
    id: string
    name: string
  }[]
}

export async function POST(req: Request){
  try {
    const { userId, title, albumId, photoUrl, tags, caption, song }: {
      userId: string
      title: string
      albumId: string
      photoUrl: string
      tags?: string[]
      caption?: string
      song?: Song
    } = await req.json()

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

    let songRecordId: string | undefined = undefined

    if(song){
      const songAlbum = await prisma.songAlbum.upsert({
        where: { id: song.album.id },
        update: {},
        create: {
          id: song.album.id,
          name: song.album.name,
          images: song.album.images.map(img => img.url),
        },
      })

      const songRecord = await prisma.song.upsert({
        where: { id: song.id },
        update: {},
        create: {
          id: song.id,
          name: song.name,
          uri: song.uri,
          previewUrl: song.preview_url,
          albumId: songAlbum.id,
          artists: {
            create: song.artists.map(a => ({
              artist: { connectOrCreate: { where: { id: a.id }, create: { id: a.id, name: a.name } } }
            }))
          }
        },
        include: { artists: { include: { artist: true } }, album: true }
      })

      songRecordId = songRecord.id
    }

    const photo = await prisma.photo.create({
      data: {
        userId,
        title,
        tags,
        albumId,
        photoUrl,
        caption,
        songId: songRecordId
      },
      include: {
        song: {
          include: { album: true, artists: { include: { artist: true } } }
        }
      }
    })

    return NextResponse.json({ success: true, photo }, { status: 201 })
  }
  catch(error){
    console.error('Error creating photo: ', error)
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
