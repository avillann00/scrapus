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
      className='cursor-pointer border-2 rounded-lg p-4 w-1/4 hover:bg-gray-400 transition duration-150 flex flex-col items-center justify-center gap-2 bg-gray-200'
    >
      <h1 className='text-lg font-semibold mb-2'>{title}</h1>
      <div className='flex flex-row gap-2 justify-center'>
        {tags.map(tag => (
          <div
            key={tag}
            className='bg-green-300 text-sm rounded-lg px-3 py-1'
          >
            {tag}
          </div>
        ))}
      </div>
      {photoUrl?.length > 0 && (
        <Image alt='Photo' width={300} height={300} className='max-h-3/4 max-w-3/4' src={photoUrl} />
      )}
      <h1 className='text-md text-black'>{caption}</h1>
    </div>
  )
}
