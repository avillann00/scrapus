'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function Login(){
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    if(response?.error){
      alert('Incorrect email or password')
    }
    else{
      router.push('/dashboard')
    }
  }

  return(
    <div className='bg-gray-200 w-screen h-screen flex flex-col items-center justify-center gap-5'>
      <h1 className='text-center text-2xl text-black'>Login</h1>
      <div className='bg-white w-1/2 h-1/2 rounded-lg shadow-lg text-black flex flex-col items-center justify-center'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <label className='flex flex-col text-center'>
            Email
            <input
              type='email'
              placeholder='example@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='text-center'
            />
          </label>
          <label className='flex flex-col text-center'>
            Password
            <input
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='text-center'
            />
          </label>
          <button className='hover:text-pink-500 mt-10' type='submit'>Login</button>
        </form>
        <button className='hover:text-blue-500' onClick={() => router.push('/register')}>Need an account?</button>
      </div>
    </div>
  )
}
