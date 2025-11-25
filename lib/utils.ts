import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import qs from 'query-string'
export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function replaceHyphensAndUnderscores (str: string) {
  return str.replace(/[-_]/g, ' ')
}

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}

export function safeParseJSON (data: any) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error('JSON parse error:', error)
      return []
    }
  }
  return data
}

export const trimText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

export const getJoinedDate = (date: Date): string => {
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()

  // creating joinging date (e.g : September 2025)
  const joinedDate = `${month} ${year}`

  return joinedDate
}

interface UrlformUrlQuery {
  params: string
  key: string
  value: string | null
}

export const formUrlQuery = ({ params, key, value }: UrlformUrlQuery) => {
  const currentUrl = qs.parse(params)

  if (value === null || value === undefined || value === '') {
    delete currentUrl[key]
  } else {
    currentUrl[key] = value
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl
    },
    { skipNull: true }
  )
}

interface removeUrlQueryParams {
  params: string
  keysToRemove: string[]
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove
}: removeUrlQueryParams) => {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach((key) => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl
    },
    { skipNull: true }
  )
}
