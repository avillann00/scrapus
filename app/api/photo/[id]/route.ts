import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }){
  try{
    const photo = await prisma.photo.findUnique({
      where: { id: params.id },
    })

    if(!photo){
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, photo }, { status: 200 })
  } 
  catch(error){
    console.error('Error fetching photo:', error)
    return NextResponse.json({ error: 'Server error fetching photo' }, { status: 500 })
  }
}

