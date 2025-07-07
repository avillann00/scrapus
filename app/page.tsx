'use client'

import { useRouter } from 'next/navigation'

export default function Home(){
  return(
    <div className='bg-gray-200 w-screen h-screen p-10'>
      <div className='fixed top-0 w-full left-0 text-black flex flex-row bg-pink-300 items-center justify-center'>
        <button className='fixed left-0 ml-5' onClick={() => router.push('/')}>Photo</button>
        <h1 className='text-xl' onClick={() => router.push('/')}>ScrapUs</h1>
        <button className='fixed right-0 mr-5 hover:text-pink-500'>Login</button>
      </div>

      <div className='flex flex-col gap-4 p-4 overflow-y-auto'>
        <h1 className='text-3xl text-black text-center flex flex-row w-full items-center justify-center gap-2 bg-white rounded-lg shadow-lg py-2'>
          Cherish your <p className='text-pink-300'>favorite</p> memories.
        </h1>

        <div className='text-black text-center text-lg bg-white rounded-lg shadow-lg p-4'>
          <button className='w-full text-center text-black hover:text-blue-500 text-xl' onClick={() => router.push('/about')}>About</button>
        </div>

        <div className='text-black text-center text-lg bg-white rounded-lg shadow-lg p-4'>
          <div>
            Create a joint account where you and whoever has access can upload photos with captions and music.
          </div>
          <div>
            Unlimited uploads, unlimited albums, unlimited access.
          </div>
          <div>
            Currently working on making your experience better.
          </div>
        </div>

        <div className='text-black text-center text-lg bg-white rounded-lg shadow-lg p-4'>
          <div>Photo</div>
          <div>Photo</div>
          <div>Photo</div>
          <div>Photo</div>
        </div>
      </div>

      <div className='fixed bottom-0 w-full left-0 text-black flex flex-row items-center justify-center gap-5 bg-pink-300'>
        <button className='hover:text-blue-500' onClick={() => router.push('/terms')}>Terms of Service</button>
        <button className='hover:text-blue-500' onClick={() => router.push('/privacy')}>Privacy Policy</button>
      </div>
    </div>
  )
}
