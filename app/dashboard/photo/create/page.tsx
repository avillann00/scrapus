'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ImageUploader from '../../../components/ImageUploader'
import Image from 'next/image'

type Album = {
  id: string,
  title: string,
  tags: string[]
}

type Song = {
  id: string
  name: string
  preview_url: string | null
  uri: string
  album: {
    id: string
    name: string
    images: { url: string }[]
  }
  artists: {
    id: string
    name: string
  }[]
}

export default function CreatePhoto(){
  const router = useRouter()
  const { data: session, status } = useSession()

  const [title, setTitle] = useState('')
  const [albumId, setAlbumId] = useState('') 
  const [albums, setAlbums] = useState<Album[]>([])
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')

  const [songSearch, setSongSearch] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)

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

    if(albumId.length < 1){
      alert('Album is required')
      return
    }

    if(!imageUrl){
      alert('Photo is required')
      return
    }

    if(!session){
      return
    }

    try{
      const response = await axios.post('/api/photo', {
        userId: session.user.id,
        title: title,
        tags: tags,
        photoUrl: imageUrl,
        albumId: albumId,
        caption: caption,
        song: selectedSong ?? undefined
      })

      console.log(response)
      router.push('/dashboard')
    }
    catch(error){
      console.error('Error creating photo: ', error)
      alert('Error creating photo')
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
    if(!session){
        return
    }

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
  }, [session, status])

  const mappedOptions = albums?.map((album: Album) => (
    <option key={album.id} value={album.id} className='text-black'>
      {album.title}
    </option>
  ))

  useEffect(() => {
    const getSongs = async () => {
      const response = await axios.get(`/api/spotify/search?song=${songSearch}`)

      setSongs(response.data)
    }

    if(songSearch.trim().length > 0){
      getSongs()
    }
  }, [songSearch])

  const mappedSongs = songs?.map((song: Song) => (
    <div 
      key={song.id} 
      className='bg-gray-100 hover:bg-gray-200 rounded-lg p-2'
      onClick={() => {
        setSelectedSong(song)

        setSongSearch('')
        setIsSearchOpen(false)
      }}
    >
      <h1>Song: {song?.name}</h1>
      <h1 className='flex flex-row gap-1 items-center justify-center'>
        Artist: {song?.artists?.map((artist: {name: string;}) => (<p key={artist?.name}>{artist?.name}</p>))}
      </h1>
      <h1>Album: {song?.album?.name}</h1>
    </div>
  ))

  return(
    <div className='bg-gray-200 w-screen min-h-screen flex flex-col items-center justify-center text-black gap-2 px-6 py-12'>
      <h1 className='text-xl'>New Photo</h1>
      <div className='bg-white w-3/5 h-5/7 rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 overflow-y-auto relative'>
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

          <label className='flex flex-col text-center'>
            Album
            <select 
              className='w-full'
              onChange={(e) => setAlbumId(e.target.value)}
              value={albumId}
            >
              <option value=''>Select an Album</option>
              {mappedOptions}
            </select>
          </label>

          <label className='flex flex-col items-center justify-center border border-dashed rounded-lg p-2 hover:bg-pink-100'>
            Photo
            <ImageUploader setImageUrl={setImageUrl} />
            {imageUrl.length > 0 && (
              <div className='flex flex-col items-center justify-center'>
                <Image width={300} height={300} alt='Selected Image' src={imageUrl} className='max-w-1/4'/>
              </div>
            )}
          </label>

          <label className='flex flex-col text-center'>
            Caption
            <input
              type='text'
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder='Caption'
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

          <button
            type='button'
            onClick={() => {
              if(!isSearchOpen){
                setIsSearchOpen(prev => !prev)
                setSongSearch('')
              }
            }}
            className={`
                flex flex-col items-center justify-start 
                bg-green-500 rounded-lg shadow-lg overflow-hidden 
                transition-all duration-500 ease-in-out
                ${isSearchOpen ? 'h-[260px] p-4' : 'h-[50px] px-6 hover:bg-green-400 w-1/2'}
            `}
          >
            <h1>{selectedSong?.name || 'No Song Selected'}</h1>
            <div 
              onClick={(e) => {
                e.stopPropagation()
                setIsSearchOpen(prev => !prev)
                setSongSearch('')
              }}
              className={`rounded-lg py-1  text-center flex flex-col gap-2 transition-all duration-300 ease-in-out cursor-pointer ${isSearchOpen? 'hover:bg-green-400 px-20' : 'px-6'}`}
            >
              <h1>{isSearchOpen ? 'Close' : 'Add Song'}</h1>
            </div>

            <div
              className={`
            transition-all duration-500 ease-in-out overflow-hidden flex flex-col gap-2 items-center justify-center rounded-lg 
            ${isSearchOpen ? 'h-[200px] opacity-100 scale-100 mt-4 bg-green-500' : 'max-h-0 opacity-0 scale-95'}
          `}
            >
              <input
                type='text'
                value={songSearch}
                onChange={(e) => setSongSearch(e.target.value)}
                placeholder='eg. For Whom The Bell Tolls'
                className='text-center border-2 border-black rounded-lg p-1 hover:bg-green-400 focus:ring-black focus:border-black'
              />
              Songs:
              <div className='flex flex-col overflow-y-auto gap-1'>{mappedSongs}</div>
            </div>

            {selectedSong?.name && (
              <div 
                className='hover:text-red-500'
                onClick={() => {
                  setSelectedSong(null)
                  setIsSearchOpen(prev => !prev)
                }}
              >
                Clear
              </div>
            )}
          </button>

          <button type='submit' className='hover:text-pink-500'>Add Photo</button>
        </form>
        <button onClick={() => router.back()} className='hover:text-blue-500'>Back</button>
      </div>
    </div>
  )
}
