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
      where: { id: songId },
      include: {
        artists: {
          include: {
            artist: true
          }
        }
      }
    })

    if(!song){
      return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    const artists = song.artists.map(({ artist }) => ({
      id: artist.id,
      name: artist.name
    }))

    return NextResponse.json({ success: true, artists }, { status: 200 })

  }
  catch(error){
    console.log('Server error getting artist: ', error)
    return NextResponse.json({ error: 'Server error getting artist' }, { status: 500 })
  }
}
