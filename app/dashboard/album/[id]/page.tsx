'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Album from '../../../components/Album'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import Photo from '../../../components/Photo'

type Album = {
  id: string,
  title: string,
  tags: string[]
  coverUrl: string
}

type Photo = {
  id: string,
  title: string,
  caption: string,
  tags: string[],
  photoUrl: string
}

export default function SingleAlbum(){
  const router = useRouter()

  const params = useParams()
  const albumId = params.id as string

  const [album, setAlbum] = useState<Album>({
    id: '',
    title: '',
    tags: [],
    coverUrl: ''
  })
  const [photos, setPhotos] = useState<Photo[]>([])
  const [order, setOrder] = useState('desc')
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)

  const limit = 9

  useEffect(() => {
    const getAlbum = async () => {
      try{
        const response = await axios.get(`/api/album/${albumId}`)

        setAlbum(response.data.album)
      }
      catch(error){
        console.error(`Error getting album with id ${albumId}: ${error}`)
      }
    }

    if(albumId){
      getAlbum()
    }
  }, [albumId])

  useEffect(() => {
    const getPhotos = async () => {
      try{
        const response = await axios.get(`/api/photo?albumId=${albumId}&order=${order}&limit=${limit}&page=${page}`)

        setPhotos(response.data.photos)
      }
      catch(error){
        console.error('Error getting photos: ', error)
      }
    }

    if(albumId){
      getPhotos()
    }
  }, [albumId, page, order])

  useEffect(() => {
    const getPhotosCount = async () => {
      const response = await axios.get(`/api/photo/count?albumId=${albumId}`)

      setCount(response.data.count)
    }

    if(albumId){
      getPhotosCount()
    }
  }, [albumId])

  const mappedPhotos = photos?.map((photo: Photo) => (
    <Photo key={photo.id} id={photo.id} title={photo.title} tags={photo.tags} photoUrl={photo.photoUrl} caption={photo.caption} />
  ))

  const decreasePage = () => {
    if(page > 1){
      setPage(prev => prev - 1)
    }
  }

  const increasePage = () => {
    if(page < Math.ceil(count / limit)){
      setPage(prev => prev + 1)
    }
  }

  return(
    <div className='w-screen min-h-screen text-black bg-gray-200 flex flex-col items-center justify-center overflow-y-auto'>
      <div className='w-2/3 h-1/2 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center gap-2 text-black overflow-y-auto'>
        <div className='flex flex-1 flex-col items-center justify-center'>
          <h1 className='text-xl font-bold mt-15'>{album?.title}</h1>
          <div className='flex flex-wrap gap-2 justify-center'>
            {album?.tags?.map(tag => (
              <div
                key={tag}
                className='bg-green-300 text-sm rounded-lg px-3 py-1'
              >
                {tag}
              </div>
            ))}
          </div>
          {album?.coverUrl.length > 0 && <Image src={album?.coverUrl} height={250} width={250} className='rounded-lg' alt='Cover' />}
        </div>

        <select
          onChange={(e) => setOrder(e.target.value)}
          value={order}
          className='mt-2'
        >
          <option value='asc'>Oldest to newest</option>
          <option value='desc'>Newest to oldest</option>
        </select>

        <div className='flex items-center justify-center w-full px-10'>
          {photos?.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
              {mappedPhotos}
            </div>
            ) : (
            <h1>There are no photos for this album</h1>
          )}
        </div>

        <div className='flex flex-row text-xl gap-2'>
          <button onClick={() => decreasePage()}><FaArrowLeft /></button>
          <div>{page}</div>
          <button onClick={() => increasePage()}><FaArrowRight /></button>
        </div>
   
        <button className='hover:text-blue-500 mb-15' onClick={() => router.back()}>back</button>
      </div>
   </div>
  )
}
