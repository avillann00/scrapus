'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

type Song = {
  id: string
  name: string
  previewUrl: string | null
  uri: string
}

type Artist = {
  id: string
  name: string
}

export default function SongPlayer({ songId }: { songId: string }){
  const [song, setSong] = useState<Song>()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [youtubeId, setYoutubeId] = useState<string | null>(null)
  const [artists, setArtists] = useState<Artist[]>([])

  useEffect(() => {
    if(!songId){
      return
    }

    const getSong = async () => {
      try{
        const response = await axios.get(`/api/song?songId=${songId}`)

        setSong(response.data.song)
      }
      catch(error){
        console.error('Error getting song: ', error)
      }
    }

    if(songId){
      getSong()
    }
  }, [songId])

  useEffect(() => {
    if(!songId){
      return
    }

    const getSongArtist = async () => {
      try{
        const response = await axios.get(`/api/artist?songId=${songId}`)

        setArtists(response.data.artists)
      }
      catch(error){
        console.error('Error getting song artists: ', error)
      }
    }

    if(song){
      if(song.previewUrl){
        setPreviewUrl(song.previewUrl)
      }
      else{
        getSongArtist()
      }
    }
  }, [song, songId])

  useEffect(() => {
    if(!song || !song.name || !artists){
      return
    }
    
    const getYoutubePreview = async () => {
      try{
        const response = await axios.get(`/api/youtube/preview`, {
          params: { name: song.name ?? '', artist: artists[0].name ?? '' }
        })

        if(response.data?.videoId){
          setYoutubeId(response.data.videoId)
        }
      }
      catch(error){
        console.error('Error getting youtube preview: ', error)
      }
    }

    if(artists){
      getYoutubePreview()
    }
  }, [artists, song])

  return(
    <div>
      {previewUrl ? (
        <audio controls src={previewUrl} autoPlay />
      ) : youtubeId ? (
        <iframe
          width='300'
          height='80'
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1`}
          title='Youtube Preview'
          allow='autoplay'
        />
      ) : (
        <h1>No song preview available</h1>
      )}
    </div>
  )
}
