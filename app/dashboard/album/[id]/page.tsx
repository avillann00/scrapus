'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Album from '../../../components/Album'

type Album = {
  id: string,
  title: string,
  tags: string[]
  coverUrl: string
}

export default function SingleAlbum(){
  const router = useRouter()

  const params = useParams()
  const albumId = params.id as string

  const [album, setAlbum] = useState<Album>({
    id: '',
    title: '',
    tags: []
  })

  useEffect(() => {
    const getAlbum = async () => {
      try{
        const response = await axios.get(`/api/album/${albumId}`)

        setAlbum(response.data.album)
      }
      catch(error){
        console.error(`Error getting album with id ${albumId}: ${error}`)
      }
    }

    if(albumId){
      getAlbum()
    }
  }, [albumId])

  return(
    <div className='w-screen h-screen text-black bg-gray-200 flex flex-col items-center justify-center'>
      <div className='w-1/2 h-1/2 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center gap-2'>
        <Album key={album.id} id={album.id} title={album.title} tags={album.tags} coverUrl={album.coverUrl} />
        <button className='hover:text-blue-500' onClick={() => router.back()}>back</button>
      </div>
    </div>
  )
}
