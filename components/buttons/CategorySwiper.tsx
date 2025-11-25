'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { categoryDisplay } from '@/types'
import React from 'react'

// Import Swiper styles
// @ts-ignorets-ignore
import 'swiper/css'
// @ts-ignorets-ignore
import 'swiper/css/navigation'
// @ts-ignorets-ignore
import 'swiper/css/pagination'
// @ts-ignorets-ignore
import 'swiper/css/autoplay'

interface CategorySwiperProps {
  categories: categoryDisplay[]
}

const CategorySwiper: React.FC<CategorySwiperProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-500 ">
        No categories available
      </div>
    )
  }

  return (
    <div className="my-4 w-full rounded  border-l-2  border-r px-4 shadow-inner">
      <div className="relative ">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}

          // autoplay={{
          //   delay: 3000,
          //   disableOnInteraction: false,
          //   pauseOnMouseEnter: true
          // }}
          spaceBetween={16}
          centeredSlides={false}
          grabCursor={true}
          className="category-swiper"
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 12
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 14
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 16
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 18
            },
            1280: {
              slidesPerView: 8,
              spaceBetween: 20
            }
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.alt} className="!w-auto">
              <Link
                href={`products?filter=${category.link}`}
                className="group flex min-w-[140px] max-w-[160px] items-center justify-center rounded-xl border border-primary-100/40 px-6 py-4 text-sm font-semibold text-primary-300/70 shadow-sm transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/50 hover:shadow-lg"
              >
                <span className="line-clamp-2 text-center text-sm font-medium leading-tight transition-colors duration-300 group-hover:text-blue-600">
                  {category.title}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev !h-8 !w-8 !rounded-full !bg-white !text-gray-600 !shadow-lg after:!text-xs after:!font-bold hover:!bg-blue-50 hover:!text-blue-600" />
        <div className="swiper-button-next !h-8 !w-8 !rounded-full !bg-white !text-gray-600 !shadow-lg after:!text-xs after:!font-bold hover:!bg-blue-50 hover:!text-blue-600" />

        {/* Custom Pagination - Positioned further down */}
      </div>
    </div>
  )
}

export default CategorySwiper
