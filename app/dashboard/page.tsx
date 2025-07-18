'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Album from '../components/Album'

type Album = {
  id: string,
  title: string,
  tags: string[]
}

type Photo = {
  id: string,
  title: string,
  caption: string,
  tags: string[],
  people: string[]
}

export default function Dashboard(){
  const router = useRouter()
  const { data: session, status } = useSession()

  const [recentAlbums, setRecentAlbums] = useState<Album[]>([])
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([])

  const [isAddOpen, setIsAddOpen] = useState(false)

  useEffect(() => {
    const getRecentAlbums = async () => {
      try{
        const response = await axios.get(`/api/album/recent?userId=${session.user.id}`)

        setRecentAlbums(response.data.albums || [])
      }
      catch(error){
        console.error('Error getting recent albums: ', error)
      }
    }

    if(status === 'authenticated'){
      getRecentAlbums()
    }
  }, [session, status])

  /*
  useEffect(() => {
    const getRecentPhotos = async () => {
      try{
        const response = await axios.get('/api/photos/recent')

        setRecentPhotos(response.data)
      }
      catch(error){
        console.error('Error getting recent photos: ', error)
      }
    }

    getRecentPhotos()
  }, [])
  */


  const mappedAlbums = recentAlbums?.map((album: Album) => (
    <Album key={album.id} id={album.id} title={album.title} tags={album.tags} />
  ))

  const mappedPhotos = recentPhotos?.map((photo: Photo) => (
    <div key={photo.id} onClick={() => router.push(`/dashboard/photo/${photo.id}`)} className='border-2 rounded-lg p-2 h-full w-1/4'>
      <h1>{photo.title}</h1>
      <h2>{photo.caption}</h2>
      <div className='flex flex-row items-center justify-center gap-1'>{mappedTags(photo.tags)}</div>
    </div>
  ))

  return(
    <div className='min-w-screen min-h-screen bg-gray-200 flex items-center justify-center'>
      <div className='w-1/2 h-3/4 bg-white flex flex-col rounded-lg shadow-lg items-center justify-center overflow-y-auto p-4 gap-4'>
        <div 
          onClick={() => setIsAddOpen(prev => !prev)}
          className={`bg-pink-300 hover:bg-pink-400 rounded-lg shadow-lg px-10 py-4 text-center flex flex-col gap-2 transition-all duration-300 ease-in-out cursor-pointer ${isAddOpen? 'px-30' : 'px-10'}`}
        >
          <button
            className='text-black text-xl'
          >
            Add
          </button>

          <div
            className={`transition-all duration-300 ease-in-out transform origin-top flex flex-col gap-2
              ${isAddOpen ? 'scale-y-100 opacity-100 pointer-events-auto mt-2' : 'scale-y-0 opacity-0 pointer-events-none h-0'}
            `}
          >
            <button
              className='bg-black rounded-lg shadow-lg p-2 hover:text-red-500 text-white px-10'
              onClick={(e) => {
                e.stopPropagation()
                router.push('/dashboard/album/create')
              }}
            >
              New Album
            </button>
            <button
              className='bg-black rounded-lg shadow-lg p-2 hover:text-red-500 text-white'
              onClick={(e) => {
                e.stopPropagation()
                router.push('/dashboard/photo/create')
              }}
            >
              New Photo
            </button>
          </div>
        </div>

        <div className='w-full text-center flex flex-col items-center justify-center p-4'>
          <div className='flex flex-row text-black w-1/2'>
            <h1 className='text-xl w-1/2 text-left'>Recent Albums</h1>
            <div className='w-1/2 text-right'>
              <button onClick={() => router.push('/dashboard/album/all')} className='hover:text-blue-500'>View all</button>
            </div>
          </div>
          {recentAlbums.length >= 1 && (
            <div className='text-black flex flex-row w-full items-center justify-center overflow-x-auto gap-1'>
              {mappedAlbums}
            </div>
          )}
        </div>

        <div className='w-full text-center flex flex-col items-center justify-center'>
          <div className='flex flex-row text-black w-1/2'>
            <h1 className='text-black text-xl'>Recent Photo</h1>
            <div className='w-1/2 text-right'>
              <button onClick={() => router.push('/dashboard/photo/all')} className='hover:text-blue-500'>View all</button>
            </div>
          </div>
          {recentPhotos.length >= 1 && (
            <div className='text-black flex flex-row w-full items-center justify-center overflow-x-auto gap-1'>
              {mappedPhotos}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
