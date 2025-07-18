'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Album = {
  id: string,
  title: string,
  tags: string[]
}

export default function CreateAlbum(){
  const router = useRouter()
  const { data: session, status } = useSession()

  const [title, setTitle] = useState('')
  const [album, setAlbum] = useState<Album>({
    id: '',
    title: '',
    tags: []
  })
  const [albums, setAlbums] = useState<Album[]>([])
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [photoFile, setPhotoFile] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  const mappedTags = tags.map((tag: string) => (
    <div key={tag} className='flex flex-row gap-1'>
      {tag}
      <button onClick={() => handleRemoveTag(tag)} className='bg-red-400 rounded-full px-2'>-</button>
    </div>
  ))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(title.length < 1){
      alert('Title is required')
      return
    }

    if(album.id.length < 1){
      alert('Album is required')
      return
    }

    if(!photoFile){
      alert('Photo is required')
      return
    }

    try{
      const response = await axios.post('/api/photo', {
        userId: session.user.id,
        title: title,
        tags: tags,
        photoUrl: photoUrl
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

  useEffect(() => {
    const getAlbums = async () => {
      try{
        const response = await axios.get(`/api/album?userId=${session.user.id}`)

        setAlbums(response.data.albums)
      }
      catch(error){
        console.error('Error getting albums: ', error)
      }
    }

    if(status === 'authenticated'){
      getAlbums()
    }
  }, [])

  const mappedOptions = albums?.map((album: Album) => (
    <option key={album.id} value={album} className='text-black'>
      {album.title}
    </option>
  ))

  return(
    <div className='bg-gray-200 w-screen h-screen flex flex-col items-center justify-center text-black gap-2'>
      <h1 className='text-xl'>New Photo</h1>
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

          <label className='flex flex-col'>
            Album
            <select 
              className='w-full'
              onChange={(e) => setAlbum(e.target.value)}
              value={album.title}
            >
              {mappedOptions}
            </select>
          </label>

          <label className='flex flex-col items-center justify-center'>
            Photo
            <input
              type='file'
              accept='image/*'
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className='text-center border border-pink-200 border-dashed rounded-lg p-2 flex flex-col hover:bg-pink-100'
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

          <button type='submit' className='hover:text-pink-500'>Add Photo</button>
        </form>
        <button onClick={() => router.back()} className='hover:text-blue-500'>Back</button>
      </div>
    </div>
  )
}
