'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { category, ServiceCard } from '@/constants'

interface Category {
  value: string
  title: string
  iconUrl: string
}

interface Servicecard {
  value: string
  title: string
  details: string
  img: { url: string, title: string }[]
}

interface CategoryButtonProps {
  item: Category
  isActive: boolean
  handleClick: (value: string) => void
}

const CategoryButton: React.FC<CategoryButtonProps> = React.memo(({ item, isActive, handleClick }) => (
  <div
    className={`flex ${
      isActive
        ? 'border-2 border-dark-400 text-dark-100'
        : 'bg-light-300 text-dark-200/70'
    } cursor-pointer flex-col items-center justify-center gap-4 rounded-t border-2 px-4 py-2 hover:border-dark-400 hover:bg-slate-400/70 hover:text-dark-100`}
    key={item.value}
    onClick={() => handleClick(item.value)}
  >
    <div className='flex items-center justify-center px-2'>
      <Image
        src={item.iconUrl}
        width={80}
        height={80}
        alt={item.iconUrl}
      />
    </div>
    <div className='flex items-center justify-center'>
      <h3 className='h3-semibold text-center font-roboto'>
        {item.title}
      </h3>
    </div>
  </div>
))

CategoryButton.displayName = 'CategoryButton'

interface ServiceDetailsProps {
  activeService?: Servicecard
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ activeService }) => (
  <div className='w-full rounded p-4'>
    {activeService && (
      <div className='flex w-full flex-col'>
        <div className='flex flex-col items-start px-4 py-2'>
          <h1 className='h1-bold font-roboto uppercase text-dark-400'>
            {activeService.title}
          </h1>
          <h3 className='paragraph-regular py-2 font-roboto text-dark-400/50'>
            {activeService.details}
          </h3>
        </div>
        <div className='flex gap-5 px-4 py-2'>
          {activeService.img.map((imgItem) => (
            <div key={imgItem.url} className='flex w-full flex-col items-center sm:w-1/2 md:w-1/3 lg:w-1/4'>
              <Link href={'/product'}>
                <Image
                  src={imgItem.url}
                  width={250}
                  height={250}
                  alt={imgItem.url}
                  className='overflow-hidden bg-fixed'
                />
              </Link>
              <Link href={'/product'}>
                <h3 className='paragraph-medium py-4 text-center font-roboto capitalize text-dark-100/80'>
                  {imgItem.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

const CategoryCard: React.FC = () => {
  const [active, setActive] = useState<string>(category[0].value)
  // eslint-disable-next-line no-undef
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setActive((prevActive) => {
        const currentIndex = category.findIndex(item => item.value === prevActive)
        const nextIndex = (currentIndex + 1) % category.length
        return category[nextIndex].value
      })
    }, 2000)
  }, [])

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    resetInterval()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [resetInterval])

  const handleClick = useCallback((value: string) => {
    setActive(value)
    resetInterval()
  }, [resetInterval])

  const activeService = useMemo(() => ServiceCard.find(item => item.value === active), [active])

  return (
    <div
      className='mt-8 flex w-full flex-col items-start justify-center bg-light-100 p-4 md:flex-row'
      onMouseEnter={stopInterval}
      onMouseLeave={resetInterval}
    >
      {/* Category buttons section */}
      <div className='order-1 flex w-full flex-col items-center gap-4 md:order-none md:w-1/4'>
        {category.map(item => {
          const isActive = active === item.value
          return (
            <CategoryButton
              key={item.value}
              // @ts-ignore
              item={item}
              isActive={isActive}
              handleClick={handleClick}
            />
          )
        })}
      </div>

      {/* Service details section */}
      <div className='order-1 flex w-full flex-col justify-between gap-6 rounded md:w-8/12'>
        <ServiceDetails activeService={activeService} />
      </div>
    </div>
  )
}

export default CategoryCard
