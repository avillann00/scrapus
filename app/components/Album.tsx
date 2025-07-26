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
      className='cursor-pointer border-2 rounded-lg p-4 w-1/4 hover:bg-gray-100 transition duration-150 flex flex-col items-center justify-center gap-2'
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
      {coverUrl?.length > 0 && (
        <Image alt='Cover photo' className='max-h-3/4 max-w-3/4' src={coverUrl} />
      )}
    </div>
  )
}
