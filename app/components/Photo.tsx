'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Photo = {
  id: string
  title: string
  tags: string[]
  photoUrl: string
  caption: string
}

export default function Photo({ id, title, tags, photoUrl, caption }: Photo){
  const router = useRouter()

  return(
    <div
      onClick={() => router.push(`/dashboard/photo/${id}`)}
      className='min-w-[200px] flex-shrink-0 hover:bg-gray-200 p-2 rounded-lg'
    >
      <div className='flex flex-row gap-2 justify-center'>
      </div>
      {photoUrl?.length > 0 && (
        <Image 
          alt='Photo' 
          width={300} 
          height={300} 
          className='rounded-lg w-full h-48 object-cover'
          src={photoUrl} 
        />
      )}
      <h1 className='text-lg font-semibold mb-2 text-center'>{title}</h1>
    </div>
  )
}
