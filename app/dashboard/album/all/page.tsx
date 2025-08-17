'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Album from '../../../components/Album'

type Album = {
  id: string,
  title: string,
  tags: string[]
  coverUrl: string
}

export default function AllAlbums(){
  const router = useRouter()
  const { data: session, status } = useSession()

  const [albums, setAlbums] = useState<Album[]>([])

  useEffect(() => {
    const getAllAlbums = async () => {
      try{
        if(!session){
          return
        }

        const response = await axios.get(`/api/album?userId=${session.user.id}`)

        setAlbums(response.data.albums)
      }
      catch(error){
        console.error('Error getting all albums: ', error)
      }
    }

    if(status === 'authenticated'){
      getAllAlbums()
    }
  }, [session, status])

  const mappedAlbums = albums?.map((album: Album) => (
    <Album key={album.id} id={album.id} title={album.title} tags={album.tags} coverUrl={album.coverUrl} />
  ))

  return(
    <div className='w-screen h-screen bg-gray-200 flex flex-col items-center justify-center text-black gap-2'>
      <h1 className='text-2xl'>All Albums</h1>
      <div
        className='bg-white w-3/5 h-2/3 rounded-lg shadow-lg flex flex-col items-center justify-center'
      >
        {albums.length < 1 ? 
          (<h1 className='text-xl'>No albums available</h1>) 
            :    
          (<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 overflow-y-auto gap-1 p-2'>{mappedAlbums}</div>)
        }
        <button onClick={() => router.back()} className='hover:text-blue-500'>Back</button>
      </div>
    </div>
  )
}
