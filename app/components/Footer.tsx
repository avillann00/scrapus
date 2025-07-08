'use client'

import { useRouter } from 'next/navigation'

export default function Footer(){
  const router = useRouter()

  return(
    <footer className='w-full p-4 border-t text-center text-sm text-black bg-pink-300 fixed bottom-0 rounded-lg shadow-lg border border-pink-300'>
      <p>
        <button onClick={() => router.push('/privacy')} className='mx-2 underline hover:text-blue-500'>
          Privacy Policy
        </button>
        ·
        <button onClick={() => router.push('/terms')} className='mx-2 underline hover:text-blue-500'>
          Terms of Service
        </button> 
        ·
        <button onClick={() => router.push('/contact')} className='mx-2 underline hover:text-blue-500'>
          Contact
        </button>
      </p>
    </footer>
  )
}
