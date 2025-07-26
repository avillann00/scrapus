'use client'

import React, { useState } from 'react'

type ImageUploaderProps = {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>
}

export default function ImageUploader({ setImageUrl } : ImageUploaderProps){
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if(!file){
      return
    }

    if(!process.env.NEXT_PUBLIC_UNSIGNED_PRESET || ! process.env.NEXT_PUBLIC_CLOUD_NAME){
      console.error('Missing unsigned presetna and cloud name .env variables')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_UNSIGNED_PRESET)

    setIsUploading(true)

    try{
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setImageUrl(data.secure_url)
    }
    catch(err){
      console.error('Upload failed:', err)
    }
    finally{
      setIsUploading(false)
    }
  }

  return(
    <div className='p-4'>
      <input type='file' accept='image/*' onChange={handleUpload} />
      {isUploading && <p>Uploading...</p>}
    </div>
  )
}
