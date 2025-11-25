'use client'

import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'

interface customProps {
  route: string
  iconPosition: string
  imgSrc: string
  placeholder: string
  otherclasses?: string
}

const LocalSearch = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherclasses
}: customProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.get('p')
  const [search, setSearch] = useState(query || '')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'p',
          value: search
        })
        router.push(newUrl, { scroll: false })
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['p']
          })
          router.push(newUrl, { scroll: false })
        }
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search, route, pathname, router, searchParams, query])

  return (
    <div className={`relative w-full ${otherclasses}`}>
      <div className='relative flex items-center'>

        <Input
          type='text'
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`
            w-full rounded-lg border border-gray-200 bg-white py-3 text-base text-gray-700 shadow-sm outline-none
            transition-all placeholder:text-gray-500 focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20
            ${iconPosition === 'left' ? 'pl-12' : 'pl-4'} 
            ${iconPosition === 'right' ? 'pr-12' : 'pr-4'}
          `}
        />

      </div>
    </div>
  )
}

export default LocalSearch
