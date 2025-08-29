import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

let accessToken = ''
let tokenExpiry = 0

async function getAccessToken(){
  if(Date.now() < tokenExpiry){
    return accessToken
  }

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
      },
    }
  )

  accessToken = response.data.access_token
  tokenExpiry = Date.now() + response.data.expires_in * 1000

  return accessToken
}

export async function GET(req: NextRequest){
  try{
    const { searchParams } = new URL(req.url)
    const song = searchParams.get('song')

    if(!song){
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    const token = await getAccessToken()

    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: song, type: 'track', limit: 10 },
    })
    console.log(response.data.tracks.items)

    return NextResponse.json(response.data.tracks.items, { status: 200 })
  } 
  catch(error: any){
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

