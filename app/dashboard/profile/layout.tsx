'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Layout({ children }: { children: ReactNode }){
  const { data: session, status } = useSession()

  const router = useRouter()

  return(
    <div className='w-screen h-screen flex flex-row'>
      <div className='min-w-1/10 h-full bg-gray-200 text-black font-bold flex flex-col items-center justify-center gap-4'>
        <div onClick={() => router.push('/dashboard/profile')} className='hover:text-blue-500'>Profile</div>
        <div onClick={() => router.push('/dashboard/profile/settings')} className='hover:text-blue-500'>Settings</div>
      </div>

      <div>
        {children}
      </div>
    </div>
  )
}
