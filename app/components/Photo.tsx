'use client'

import { useRouter } from 'next/navigation'

type Photo = {
  id: string
  title: string
  tags: string[]
}

export default function Photo({ id, title, tags }: Photo){
  const router = useRouter()

  return(
    <div
      onClick={() => router.push(`/dashboard/photo/${id}`)}
      className='cursor-pointer border-2 rounded-lg p-4 w-1/4 hover:bg-gray-100 transition duration-150'
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
    </div>
  )
}
