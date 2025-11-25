import React from 'react'
import Link from 'next/link'

/**
    * LinkButton
 * @param {string} href - The URL to link to
 * @param {string} text - The text to display in the button
 * @param {string} customClasses - Any additional classes to add to the button
 * @param {string} target - The target attribute for the link
 */

interface LinkButtonProps {
  href: string
  text: string
  customClasses?: string
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, text, customClasses }) => {
  return (
    <Link
      href={href}
      className={`inline-block rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900 ${customClasses}`}
    >
      {text}
    </Link>
  )
}

export default LinkButton