import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card'

export const LoginPageSkeleton = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-2'>
          {/* Title Skeleton */}
          <Skeleton className='h-8 w-3/4 mx-auto bg-gray-400' />
          {/* Description Skeleton */}
          <Skeleton className='h-4 w-full mx-auto bg-gray-400' />
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Form Field 1 Skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-1/4 bg-gray-400' />
            <Skeleton className='h-10 w-full bg-gray-400' />
          </div>

          {/* Form Field 2 Skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-1/4 bg-gray-400' />
            <Skeleton className='h-10 w-full bg-gray-400' />
          </div>

          {/* Button Skeleton */}
          <Skeleton className='h-10 w-full bg-gray-400' />
        </CardContent>

        <CardFooter className='justify-center'>
          {/* Footer Link Skeleton */}
          <Skeleton className='h-4 w-1/2 bg-gray-400' />
        </CardFooter>
      </Card>
    </div>
  )
}