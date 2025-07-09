'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function CreateAlbum(){
  const router = useRouter()
  const { data: session, status } = useSession()

  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [coverFile, setCoverFile] = useState('')
  const [coverUrl, setCoverUrl] = useState('')

  const mappedTags = tags.map((tag: string) => (
    <div key={tag} className='flex flex-row gap-1'>
      {tag}
      <button onClick={() => handleRemoveTag(tag)} className='bg-red-400 rounded-full px-2'>-</button>
    </div>
  ))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try{
      const response = await axios.post('/api/album', {
        userId: session.user.id,
        title: title,
        tags: tags,
        coverUrl: coverUrl
      })

      router.push('/dashboard')
    }
    catch(error){
      console.error('Error creating album: ', error)
      alert('Error creating album')
    }
  }

  const handleAddTag = () => {
    if(tag.trim().length < 1){
      alert('Tag cannot be empty')
      return
    }
    if(tags.includes(tag.trim())){
      alert('Tag already added')
      return
    }

    setTags((prev) => ([...prev, tag.trim()]))
    setTag('')
  }

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter(s => s !== tag))
  }

  return(
    <div className='bg-gray-200 w-screen h-screen flex flex-col items-center justify-center text-black gap-2'>
      <h1 className='text-xl'>New Album</h1>
      <div className='bg-white w-3/5 h-3/5 rounded-lg shadow-lg flex flex-col items-center justify-center gap-2'>
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4'>
          <label className='flex flex-col items-center justify-center'>
            Title
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Title'
              className='text-center'
            />
          </label>

          <label className='flex flex-col items-center justify-center'>
            Tags
            <div className='flex flex-row'>
              <input
                type='text'
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder='eg. Family, Pets, Vacation'
                className='text-center'
              />
              <button type='button' onClick={handleAddTag} className='bg-green-400 rounded-full px-2 ml-2'>+</button>
            </div>
            {tags.length > 0 && (
              <div className='flex flex-row items-center justify-center gap-4 overflow-x-auto mt-2'>
                {mappedTags}
              </div>
            )}
          </label>

          <label className='flex flex-col items-center justify-center'>
            Cover Image
            <input
              type='file'
              accept='image/*'
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className='text-center border border-pink-200 border-dashed rounded-lg p-2 flex flex-col hover:bg-pink-100'
            />
          </label>
          <button type='submit' className='hover:text-pink-500'>Create Album</button>
        </form>
        <button onClick={() => router.back()} className='hover:text-blue-500'>Back</button>
      </div>
    </div>
  )
}
