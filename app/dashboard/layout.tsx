'use client'

import { ReactNode } from 'react'
import { FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function Layout({ children }: { children: ReactNode }){
  const router = useRouter()

  const { status } = useSession()

  if(status === 'loading'){
    return <div className='text-center text-black text-2xl mt-20'>Loading...</div>
  }

  if(status  === 'unauthenticated'){
    return(
      <div className='h-screen w-screen bg-gray-200 flex flex-col items-center justify-center'>
        <div className='h-1/2 w-1/2 rounded-lg shadow-lg bg-white flex flex-col justify-center items-center'>
          <h1 className='text-2xl text-black'>You need to login first</h1>
          <button onClick={() => router.push('/login')} className='text-black hover:text-blue-500'>Login</button>
        </div>
      </div>
    )
  }
  return(
    <div className='bg-gray-200'>
      <div 
        className='bg-pink-300 text-black items-center w-full flex flex-row h-10 px-4 shadow-lg rounded-lg justify-between fixed top-0 z-50'
      >
        <Image className='w-1/3' width={10} height={10} alt='Logo' src='/public/window.svg' />
        <h1 className='text-black w-1/3 text-center text-2xl' onClick={() => router.push('/dashboard')}>ScrapUs</h1>
        <FaUser size={24} color='gray' className='w-1/3' onClick={() => router.push('/dashboard/profile')} />
      </div>

      <div className=''>
        {children}
      </div>
    </div>
  )
}
