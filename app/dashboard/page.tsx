'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

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

  const [recentAlbums, setRecentAlbums] = useState<Album[]>([])
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([])

  const [isAddOpen, setIsAddOpen] = useState(false)

  /*
  useEffect(() => {
    const getRecentAlbums = async () => {
      try{
        const response = await axios.get('/api/albums/recent')

        setRecentAlbums(response.data)
      }
      catch(error){
        console.error('Error getting recent albums: ', error)
      }
    }

    getRecentAlbums()
  }, [])

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
    <div key={album.id} onClick={() => router.push(`/dashboard/album?id=${album.id}`)}>
      <h1>{album.title}</h1>
    </div>
  ))

  const mappedPhotoTags = (photo: Photo) => {
    return(
      photo?.tags?.map((tag: string) => (
        <div key={tag}>
          {tag}
        </div>
      ))
    )
  }

  const mappedPhotos = recentPhotos?.map((photo: Photo) => (
    <div key={photo.id} onClick={() => router.push(`/dashboard/photo?id=${photo.id}`)}>
      <h1>{photo.title}</h1>
      <h1>{photo.caption}</h1>
      <h1>{mappedPhotoTags(photo)}</h1>
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
                router.push('/dashboard/album')
              }}
            >
              New Album
            </button>
            <button
              className='bg-black rounded-lg shadow-lg p-2 hover:text-red-500 text-white'
              onClick={(e) => {
                e.stopPropagation()
                router.push('/dashboard/photo')
              }}
            >
              New Photo
            </button>
          </div>
        </div>

        <div>
          <h1 className='text-black text-xl'>Recent Albums</h1>
          {recentAlbums.length >= 1 && (
            <div>
              {mappedAlbums}
            </div>
          )}
        </div>

        <div>
          <h1 className='text-black text-xl'>Recent Photo</h1>
          {recentPhotos.length >= 1 && (
            <div>
              {mappedPhotos}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
