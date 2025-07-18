'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Photo from '../../../components/Photo'

type Photo = {
  id: string,
  title: string,
  tags: string[]
}

export default function SinglePhoto(){
  const router = useRouter()

  const params = useParams()
  const photoId = params.id as string

  const [photo, setPhoto] = useState<Photo>({
    id: '',
    title: '',
    tags: []
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
      <div className='w-1/2 h-1/2 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center gap-2'>
        <Photo key={photo.id} id={photo.id} title={photo.title} tags={photo.tags} />
        <button className='hover:text-blue-500' onClick={() => router.back()}>back</button>
      </div>
    </div>
  )
}
