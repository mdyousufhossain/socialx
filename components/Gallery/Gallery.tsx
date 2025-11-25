'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Check, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'

interface GalleryDrawerProps {
  onSelect: (selectedUrls: string[]) => void
  existingImages?: string[]
}

const Gallery = ({
  onSelect,
  existingImages = []
}: GalleryDrawerProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/get-image')
        const data = await response.json()
        setImages(data.images)
      } catch (error) {
        console.error('Error fetching images:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageUrl)
        ? prev.filter((url) => url !== imageUrl)
        : [...prev, imageUrl]
    )
  }

  const handleConfirm = () => {
    onSelect(selectedImages)
    setSelectedImages([])
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          <ImageIcon className='size-4' />
          Select from Gallery
        </Button>
      </DrawerTrigger>

      <DrawerContent className='h-[85vh]'>
        <DrawerHeader>
          <DrawerTitle>Select Images from Gallery</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
          {loading
            ? (
            <div className='flex h-full items-center justify-center'>
              <div className='border-primary size-8 animate-spin rounded-full border-4 border-t-transparent' />
            </div>
              )
            : (
            <>
              <div className='grid grid-cols-2 gap-4 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 ${
                      selectedImages.includes(imageUrl)
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                    onClick={() => handleImageSelect(imageUrl)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className='object-cover'
                    />
                    {selectedImages.includes(imageUrl) && (
                      <div className='bg-primary/20 absolute inset-0 flex items-center justify-center'>
                        <Check className='size-8 text-white' />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className='sticky bottom-0 mt-4 flex justify-end gap-2 border-t bg-white p-4'>
                <DrawerClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DrawerClose>
                <Button
                  onClick={handleConfirm}
                  disabled={selectedImages.length === 0}
                >
                  Add Selected ({selectedImages.length})
                </Button>
              </div>
            </>
              )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default Gallery
