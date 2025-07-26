'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register(){
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [names, setNames] = useState<string[]>([])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(email.length < 1){
      alert('Email is required')
      return
    }
    if(names.length < 1){
      alert('There needs to be at least one name')
      return
    }
    if(password.length < 1){
      alert('Password is required')
      return
    }
    if(password !== confirmPassword){
      alert('Passwords do not match')
      return
    }

    try{
      const response = await axios.post('/api/register', {
        email: email,
        names: names,
        password: password
      })

      console.log(response)
      router.push('/login')
    }
    catch(error){
      console.error('Error registering user: ', error)
      alert('Error with registration')
    }

  }

  const mappedNames = names?.map((name: string) => (
    <div key={name} className='flex flex-row gap-1'>
      {name}
      <button className='bg-red-400 rounded-full px-2' onClick={() => handleRemove(name)}>-</button>
    </div>
  ))

  const handleRemove = (name: string) => {
    setNames((prev) => prev.filter((s) => s !== name))
  }

  const handleAdd = () => {
    if(name.trim().length < 1){
      alert('Name cannot be blank')
      return
    }
    if(names.includes(name.trim())){
      alert('Name already added')
      return
    }

    setNames((prev) => ([...prev, name.trim()]))
    setName('')
  }
  
  return(
    <div className='bg-gray-200 w-screen h-screen flex flex-col items-center justify-center gap-5'>
      <h1 className='text-center text-2xl text-black'>Register</h1>
      <div className='bg-white w-1/2 h-4/5 rounded-lg shadow-lg text-black flex flex-col items-center justify-center'>
        <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
          <label className='flex flex-col text-center'>
            Email
            <input
              type='email'
              className='text-center'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='example@example.com'
            />
          </label>
          <label className='flex flex-col text-center'>
            Names
            <div className='flex flex-row items-center ml-3 justify-center w-full gap-2'>
              <input
                type='text'
                className='text-center'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter Name'
              />
              <button type='button' className='bg-green-400 rounded-full px-2' onClick={handleAdd}>+</button>
            </div>
          </label>
          {names.length > 0 && (
            <div className='flex flex-row items-center justify-center gap-4 overflow-x-auto'>
              {mappedNames}
            </div>
          )}
          <label className='flex flex-col text-center'>
            Password
            <input
              type='password'
              className='text-center'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />
          </label>
          <label className='flex flex-col text-center'>
            Confirm Password
            <input
              type='password'
              className='text-center'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm Password'
            />
          </label>
          <button type='submit' className='hover:text-pink-500'>Register</button>
        </form>
        <button className='hover:text-blue-500' onClick={() => router.push('/login')}>Already have an account?</button>
      </div>
    </div>
  )
}
