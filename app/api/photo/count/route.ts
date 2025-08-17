import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request){
  try{
    const { searchParams } = new URL(req.url)

    const albumId = searchParams.get('albumId')

    if(!albumId){
      return NextResponse.json({ error: 'Missing album id' }, { status: 400})
    }

    const count = await prisma.photo.count({
      where: { albumId }
    })

    return NextResponse.json({ success: true, count }, { status: 200 })
  }
  catch(error){
    console.error('Error getting photos count:', error)
    return NextResponse.json({ error: 'Server error getting photos count' }, { status: 500 })
  }
}
