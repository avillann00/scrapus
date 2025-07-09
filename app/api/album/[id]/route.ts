import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }){
  try{
    const album = await prisma.album.findUnique({
      where: { id: params.id },
    })

    if(!album){
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, album }, { status: 200 })
  } 
  catch(error){
    console.error('Error fetching album:', error)
    return NextResponse.json({ error: 'Server error fetching album' }, { status: 500 })
  }
}
