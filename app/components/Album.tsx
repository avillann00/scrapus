'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Album = {
  id: string
  title: string
  tags: string[]
  coverUrl: string
}

export default function Album({ id, title, tags, coverUrl }: Album){
  const router = useRouter()

  return(
    <div
      onClick={() => router.push(`/dashboard/album/${id}`)}
      className='min-w-[200px] min-h-[200px] flex-shrink-0 hover:bg-gray-200 p-2 rounded-lg flex flex-col gap-1'
    >
      <h1 className='text-lg font-semibold mb-1'>{title}</h1>
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
      {coverUrl?.length > 0 && (
        <Image 
          alt='Cover photo' 
          width={200} 
          height={200} 
          className='rounded-lg w-full h-48 object-cover'
          src={coverUrl} 
        />
      )}
    </div>
  )
}
