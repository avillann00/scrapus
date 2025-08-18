'use client'

import { useSession, signOut } from 'next-auth/react'

export default function Profile(){
  const { data: session } = useSession()

  return(
    <div className='bg-white h-screen w-screen flex flex-col items-center justify-center text-black gap-4'>
      <h1>Profile</h1>
      <h1>Email: {session?.user?.email}</h1>
      <h1>Users: {session?.user?.names?.map((name: string) => (<div key={name}>{name}</div>))}</h1>
      <button onClick={() => signOut({ callbackUrl: '/' })} className='hover:text-red-400'>Logout</button>
    </div>
  )
}
