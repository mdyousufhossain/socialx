/* eslint-disable multiline-ternary */
'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X, ChevronDown } from 'lucide-react'

export default function Header () {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setIsDropdownOpen(false)
      setIsMobileMenuOpen(false)
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className='sticky top-0 z-50 w-full bg-white shadow-md'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='shrink-0'>
            <h1
              className='cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-2xl font-bold text-transparent'
              onClick={() => router.push('/')}
            >
              Social X
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-8 md:flex'>
            <button
              onClick={() => handleNavigation('/')}
              className='font-medium text-gray-600 transition hover:text-blue-600'
            >
              Home
            </button>
            {isAuthenticated && (
              <button
                onClick={() => handleNavigation('/profile')}
                className='font-medium text-gray-600 transition hover:text-blue-600'
              >
                Profile
              </button>
            )}
          </nav>

          {/* Auth Section */}
          <div className='flex items-center gap-4'>
            {isAuthenticated && user ? (
              <div className='relative'>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className='flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 transition hover:bg-blue-100'
                >
                  {/* Avatar */}
                  <div className='flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700'>
                    <span className='text-sm font-bold text-white'>
                      {user.username?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        'U'}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className='hidden text-left sm:block'>
                    <p className='text-sm font-semibold text-gray-800'>
                      {user.username || user.email?.split('@')[0]}
                    </p>
                    <p className='text-xs text-gray-500'>{user.email}</p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`text-gray-600 transition ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className='absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg'>
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100'
                    >
                      <div className='flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700'>
                        <span className='text-xs font-bold text-white'>
                          {user.username?.charAt(0).toUpperCase() ||
                            user.email?.charAt(0).toUpperCase() ||
                            'U'}
                        </span>
                      </div>
                      Profile
                    </button>
                    <hr className='my-2 border-gray-200' />
                    <button
                      onClick={handleLogout}
                      className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50'
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='hidden gap-3 sm:flex'>
                <button
                  onClick={() => handleNavigation('/login')}
                  className='px-4 py-2 font-medium text-blue-600 transition hover:text-blue-700'
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700'
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='rounded-lg p-2 transition hover:bg-gray-100 md:hidden'
            >
              {isMobileMenuOpen ? (
                <X size={24} className='text-gray-600' />
              ) : (
                <Menu size={24} className='text-gray-600' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='border-t border-gray-200 bg-gray-50 py-4 md:hidden'>
            <div className='flex flex-col gap-3'>
              <button
                onClick={() => handleNavigation('/feeds')}
                className='rounded px-4 py-2 text-left text-gray-700 transition hover:bg-gray-200'
              >
                Feeds
              </button>
              <button
                onClick={() => handleNavigation('/')}
                className='rounded px-4 py-2 text-left text-gray-700 transition hover:bg-gray-200'
              >
                Home
              </button>
              <hr className='my-2 border-gray-300' />
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className='rounded px-4 py-2 text-left text-gray-700 transition hover:bg-gray-200'
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className='rounded px-4 py-2 text-left font-medium text-red-600 transition hover:bg-red-50'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/login')}
                    className='rounded px-4 py-2 text-left text-blue-600 transition hover:bg-blue-50'
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className='rounded bg-blue-600 px-4 py-2 text-left text-white transition'
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
