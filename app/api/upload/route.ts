import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST (req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('images')

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files received' }, { status: 400 })
    }

    const uploadPromises = files.map(async (file: any) => {
      if (!file) {
        throw new Error('Invalid file')
      }

      try {
        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64String = buffer.toString('base64')
        const uploadStr = `data:${file.type};base64,${base64String}`

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(uploadStr, {
          folder: 'product-images',
          resource_type: 'auto'
        })

        return uploadResponse.secure_url
      } catch (error) {
        console.error('Error processing file:', error)
        throw error
      }
    })

    const urls = await Promise.all(uploadPromises)

    return NextResponse.json({
      success: true,
      urls
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      },
      { status: 500 }
    )
  }
}
