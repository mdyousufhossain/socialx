import React from 'react'

export interface NavbarLink {
  iconUrl?: string
  route: string
  label: string
}

export interface RoutePermissions {
  public: string[];
  protected: {
    [role: string]: string[];
  };
}

export interface socialLink {
  iconUrl: string
  alt: string
  sociallink: string
}
export interface aboutitems {
  iconUrl: string
  title: string
  subtitle: string
}

export interface CatageryType {
  iconUrl: string
  value: string
  title: string
}
export interface ServiceCardType {
  value: string
  title: string
  details: string
  img: {
    url: string
    title: string
  }[]
}

export interface ServiceType {
  id: number
  title: string
  details: string
  icon: string
}

export interface categoryDisplay {
  imageSrc: string
  alt: string
  title: string
  link: string
}

export interface IProductCreate {
  _id:string
  title: string
  productid: string
  specifications: Array<{
    title: string
    details: string
  }>
  materials: Array<{
    title: string
    details: string
  }>
  questions: Array<{
    question: string
    answer: string
  }>
  price: string
  code: string
  description: string
  category: string
  images: Array[]
  path: string
  stock: string
  tags: string[]
}

export interface ProductCreate {
  title: string
  productid: string
  specifications: string
  materials: string
  questions: string
  images: string
  category: string
  path: string
  creator: string
  tags: string
  stock: string
  price: string | number
  code: string
  description?: string
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined }
}

interface Slide {
  src: string
  link?: string
  alt: string
  external?: boolean
}

export interface CarouselProps {
  images: Slide[]
  title?: string
  subtitle?: string
  autoplay?: boolean
  loop?: boolean
  showPagination?: boolean
  showNavigation?: boolean
  customStyles?: string
  dimension?: string
  children?: React.ReactNode
  childrenStyle?: string
}

export interface GetProductAllParams {
  searchQuery: string
  filter: string
  page: number
  pageSize: number
}

export interface SectionStatus {
  specifications: boolean
  materials: boolean
  questions: boolean
  images: boolean
  tags: boolean
  basicInfo: boolean
}

export interface Specification {
  title: string
  details: string
}

export interface Material {
  title: string
  details: string
}

export interface Question {
  question: string
  answer: string
}

export interface ValidationErrors {
  [key: string]: string
}

export interface IUser {
  _id: string
  username: string
  email: string
  role: string
}
export interface UpdateUserData {
  username?: string
  email?: string
}
