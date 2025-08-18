'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'

type Photo = {
  id: string,
  title: string,
  caption: string,
  tags: string[],
  photoUrl: string
}

export default function SinglePhoto(){
  const router = useRouter()

  const params = useParams()
  const photoId = params.id as string

  const [photo, setPhoto] = useState<Photo>({
    id: '',
    title: '',
    tags: [],
    caption: '',
    photoUrl: ''
  })

  useEffect(() => {
    const getPhoto = async () => {
      try{
        const response = await axios.get(`/api/photo/${photoId}`)

        setPhoto(response.data.photo)
      }
      catch(error){
        console.error(`Error getting photo with id ${photoId}: ${error}`)
      }
    }

    if(photoId){
      getPhoto()
    }
  }, [photoId])

  return(
    <div className='w-screen h-screen text-black bg-gray-200 flex flex-col items-center justify-center'>
      <div className='w-1/2 h-1/2 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center gap-2 overflow-y-auto p-4'>
        <h1 className='text-xl font-bold'>{photo.title}</h1>
        {photo?.tags?.map(tag => (
          <div
            key={tag}
            className='bg-green-300 text-sm rounded-lg px-3 py-1'
          >
            {tag}
          </div>
        ))}
        {photo?.photoUrl && <Image src={photo?.photoUrl ?? null} width={300} height={300} className='rounded-lg' alt='Photo' />}
        {photo?.caption?.length > 0 && <div className='border-2 border-black rounded-lg px-4 py-2'>{photo?.caption}</div>}
        <button className='hover:text-blue-500' onClick={() => router.back()}>back</button>
      </div>
    </div>
  )
}
