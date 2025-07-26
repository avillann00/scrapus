'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Photo from '../../../components/Photo'

type Photo = {
  id: string,
  title: string,
  caption: string,
  tags: string[],
  photoUrl: string
}

export default function AllPhotos(){
  const router = useRouter()
  const { data: session, status } = useSession()

  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const getAllPhotos = async () => {
      try{
        if(!session){
          return
        }

        const response = await axios.get(`/api/photo?userId=${session.user.id}`)

        setPhotos(response.data.photos)
      }
      catch(error){
        console.error('Error getting all photos: ', error)
      }
    }

    if(status === 'authenticated'){
      getAllPhotos()
    }
  }, [session, status])

  const mappedPhotos = photos?.map((photo: Photo) => (
    <Photo key={photo.id} id={photo.id} title={photo.title} tags={photo.tags} photoUrl={photo.photoUrl} caption={photo.caption} />
  ))

  return(
    <div className='w-screen h-screen bg-gray-200 flex flex-col items-center justify-center text-black gap-2'>
      <h1 className='text-2xl'>All Photos</h1>
      <div className='bg-white w-3/5 h-2/3 rounded-lg shadow-lg flex flex-col items-center justify-center'>
        {photos.length < 1 ? 
          (<h1 className='text-xl'>No photos available</h1>) 
            :    
          (<div className='flex flex-col gap-2 overflow-y-auto w-full items-center'>{mappedPhotos}</div>)
        }
        <button onClick={() => router.back()} className='hover:text-blue-500'>Back</button>
      </div>
    </div>
  )
}
