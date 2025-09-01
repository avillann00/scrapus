import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'

export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const artist = searchParams.get('artist')

  if(!name){
    return NextResponse.json({ error: 'Missing song name' }, { status: 400 })
  }

  try{
    const query = encodeURIComponent(`${name} ${artist}`)
    const apiKey = process.env.YOUTUBE_API_KEY

    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${apiKey}`)

    const videoId = response.data.items?.[0].id?.videoId ?? null

    return NextResponse.json({ success: true, videoId }, { status: 200 })
  }
  catch(error){
    console.error('Server error getting youtube preview: ', error)
    return NextResponse.json({ error: 'Server error getting youtube preview' }, { status: 500 })
  }
}

