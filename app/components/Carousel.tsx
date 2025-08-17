'use client'

import { useRef } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import Photo from './Photo'
import Album from './Album'

type Photo = {
  id: string
  title: string
  photoUrl: string
}

type Album = {
  id: string
  title: string
  tags: string[]
  coverUrl: string
}

type CarouselItem = {
  items: CarouselItem[]
}

export default function Carousel({ items }: CarouselProps){
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if(scrollRef.current){
      const { clientWidth } = scrollRef.current
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -clientWidth : clientWidth,
        behavior: 'smooth',
      })
    }
  }

  const mappedItems = items?.map((item: CarouselItem) => {
    if('photoUrl' in item){
      return(
        <Photo key={item.id} id={item.id} title={item.title} tags={item.tags} photoUrl={item.photoUrl} caption={item.caption} />
      )
    }
    else{
      return(
        <Album key={item.id} id={item.id} title={item.title} tags={item.tags} coverUrl={item.coverUrl} />
      )
    }
  })

  return(
    <div className='relative w-full'>
      <button
        onClick={() => scroll('left')}
        className='absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100'
      >
        <FaArrowLeft />
      </button>

      <div
        ref={scrollRef}
        className='flex flex-row gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full p-4 items-center justify-start'
      >
        {mappedItems}
      </div>

      <button
        onClick={() => scroll('right')}
        className='absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-100'
      >
        <FaArrowRight />
      </button>
    </div>
  )
}
