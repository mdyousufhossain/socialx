'use client'

export default function SocialFeedsSkeleton () {
  return (
    <div className='mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8'>
      {/* Post Creation Skeleton */}
      <div className='overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200'>
        <div className='border-b border-gray-100 p-6'>
          <p className='mb-4 text-gray-700'>What&apos;s on your mind?</p>
          <div className='mb-4 h-24 w-full animate-pulse rounded-lg bg-gray-200' />

          <div className='flex items-center gap-3'>
            <div className='h-10 w-24 animate-pulse rounded-lg bg-gray-200' />
            <div className='h-10 w-32 animate-pulse rounded-lg bg-gray-200' />
          </div>
        </div>
      </div>

      {/* Posts Loading Skeleton */}
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className='overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200'
        >
          {/* Post Header Skeleton */}
          <div className='border-b border-gray-100 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='size-10 animate-pulse rounded-full bg-gray-200' />
                <div className='space-y-2'>
                  <div className='h-4 w-24 animate-pulse rounded bg-gray-200' />
                  <div className='h-3 w-16 animate-pulse rounded bg-gray-200' />
                </div>
              </div>
              <div className='h-6 w-20 animate-pulse rounded-full bg-gray-200' />
            </div>
          </div>

          {/* Post Content Skeleton */}
          <div className='space-y-3 px-6 py-4'>
            <div className='h-4 w-full animate-pulse rounded bg-gray-200' />
            <div className='h-4 w-5/6 animate-pulse rounded bg-gray-200' />
            <div className='h-4 w-4/6 animate-pulse rounded bg-gray-200' />
          </div>

          {/* Post Media Skeleton */}
          <div className='bg-gray-50 px-6 py-4'>
            <div className='h-64 w-full animate-pulse rounded-lg bg-gray-200' />
          </div>

          {/* Post Stats Skeleton */}
          <div className='border-t border-gray-100 bg-gray-50 px-6 py-3'>
            <div className='flex justify-between gap-4'>
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
              <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
              <div className='h-4 w-16 animate-pulse rounded bg-gray-200' />
            </div>
          </div>

          {/* Post Actions Skeleton */}
          <div className='flex gap-1 px-5 py-3 sm:px-6'>
            {[...Array(3)].map((_, btnIdx) => (
              <div
                key={btnIdx}
                className='h-10 flex-1 animate-pulse rounded-lg bg-gray-200'
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
