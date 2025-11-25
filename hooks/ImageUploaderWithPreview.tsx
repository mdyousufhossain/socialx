import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface ImageUploaderProps {
  onUpload: (files: File[]) => void
  maxImages?: number
  initialImages?: string[]
}

interface ValidationError {
  file: string
  error: string
}

const ImageUploaderWithPreview: React.FC<ImageUploaderProps> = ({
  onUpload,
  maxImages = 8,
  initialImages = []
}) => {
  // Separate state for initial URLs and file previews
  const [initialUrls] = useState<string[]>(initialImages)
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateImage = (file: File): Promise<ValidationError | null> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.src = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(img.src)
        const errors: string[] = []

        if (file.size > 5 * 1024 * 1024) {
          errors.push('Image size must be less than 5MB')
        }
        // Check dimensions
        if (img.width < 80 || img.height < 80) {
          errors.push('Image dimensions must be at least 80x80 pixels')
        }
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height
        // Define allowed aspect ratios
        const allowedRatios = [
          { ratio: 1, name: '1:1 (Square)', tolerance: 0.1 },
          { ratio: 1.5, name: '3:2', tolerance: 0.1 },
          { ratio: 1.33, name: '4:3', tolerance: 0.1 },
          { ratio: 1.6, name: '16:10', tolerance: 0.1 },
          { ratio: 1.77, name: '16:9', tolerance: 0.1 }
        ]

        // Check if image allowed ratio
        const matchedRatio = allowedRatios.find(
          ({ ratio, tolerance }) => Math.abs(aspectRatio - ratio) <= tolerance
        )

        if (!matchedRatio) {
          errors.push(
            'Image must match one of these aspect ratios: Square (1:1), 3:2, 4:3, 16:10, or 16:9'
          )
        }

        // Check if image is portrait (height > width)
        if (img.height > img.width) {
          errors.push(
            'Portrait orientation is not allowed. Please use landscape or square images.'
          )
        }

        if (errors.length > 0) {
          resolve({ file: file.name, error: errors.join(', ') })
        } else {
          resolve(null)
        }
      }

      img.onerror = () => {
        resolve({ file: file.name, error: 'Failed to load image' })
      }
    })
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || [])
    setValidationErrors([])

    // Check total images (initial + new files)
    if (initialUrls.length + selectedFiles.length + files.length > maxImages) {
      setValidationErrors([
        {
          file: 'general',
          error: `You can only upload up to ${maxImages} images.`
        }
      ])
      return
    }

    const validationResults = await Promise.all(files.map(validateImage))
    const errors = validationResults.filter(
      (result): result is ValidationError => result !== null
    )

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    const newFiles = [...selectedFiles, ...files]

    setFilePreviewUrls((prev) => [...prev, ...newPreviewUrls])
    setSelectedFiles(newFiles)
    onUpload(newFiles)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number, isInitialImage: boolean) => {
    if (isInitialImage) {
      // Don't remove initial images, just notify parent if needed
      return
    }

    // Remove from file preview URLs
    setFilePreviewUrls((prev) => prev.filter((_, i) => i !== index))

    // Remove from selected files
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedFiles)
    onUpload(updatedFiles)

    // Cleanup object URL
    URL.revokeObjectURL(filePreviewUrls[index])
  }

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      filePreviewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [filePreviewUrls])

  return (
    <div className='space-y-4'>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={handleImageChange}
        disabled={initialUrls.length + selectedFiles.length >= maxImages}
        className={`block w-full cursor-pointer rounded-lg border ${
          initialUrls.length + selectedFiles.length >= maxImages
            ? 'cursor-not-allowed bg-gray-200 text-gray-500'
            : 'bg-gray-50 text-gray-900'
        } text-sm focus:outline-none`}
      />

      {validationErrors.length > 0 && (
        <div className='rounded-lg bg-red-50 p-4'>
          {validationErrors.map((error, index) => (
            <p key={index} className='text-sm text-red-600'>
              {error.file !== 'general' ? `${error.file}: ` : ''}
              {error.error}
            </p>
          ))}
        </div>
      )}

      <div className='flex flex-wrap gap-2'>
        {/* Display initial images */}
        {initialUrls.map((url, index) => (
          <div key={`initial-${url}`} className='relative'>
            <Image
              src={url}
              alt={`Initial ${index + 1}`}
              width={150}
              height={100}
              className='rounded-lg object-cover'
            />
          </div>
        ))}

        {/* Display new file previews */}
        {filePreviewUrls.map((url, index) => (
          <div key={`preview-${url}`} className='relative'>
            <Image
              src={url}
              alt={`Preview ${index + 1}`}
              width={150}
              height={100}
              className='rounded-lg object-cover'
            />
            <button
              type='button'
              onClick={() => removeImage(index, false)}
              className='absolute right-1 top-1 rounded-full bg-red-500 p-1 text-xs text-white shadow hover:bg-red-600'
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {initialUrls.length + selectedFiles.length >= maxImages && (
        <p className='text-sm text-red-500'>
          Maximum of {maxImages} images reached.
        </p>
      )}
    </div>
  )
}

export default ImageUploaderWithPreview
