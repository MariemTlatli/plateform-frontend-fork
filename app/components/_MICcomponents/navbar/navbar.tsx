'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { Inter } from 'next/font/google'

import { useAuthStore } from '@/store/MyStore/AuthStore'

const inter = Inter({ subsets: ['latin-ext'], weight: '400' })

export default function Navbar() {
  const logout = useAuthStore(state => state.logout)
  const user = useAuthStore(state => state.user)
  const currentDepartment = useAuthStore(state => state.currentDepartment)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const getUserInitials = () => {
  //   if (user.nomPrenom) {
  //     const [firstName, lastName] = user.nomPrenom.split(' ')
  //     return `${firstName.charAt(0)}${lastName.charAt(0)}`
  //   }
  //   return ''
  // }
  const handleLogOut = async () => {
    try {
      await logout()
      // window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <nav className='fixed left-0 top-0 z-10 w-full bg-navbar py-3 text-white'>
      <div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-3'>
        {/* Logo Section with custom logo */}
        <Link
          href='/'
          className='flex items-center space-x-3 rtl:space-x-reverse'
        >
          <Image
            src='/images/main-logo.png'
            width={37}
            height={37}
            className='object-fit h-8 cursor-pointer object-cover'
            alt='Microsoft Issatso Logo'
          />
          <span
            className={`${inter.className} hidden self-center whitespace-nowrap text-2xl font-semibold md:block`}
          >
            Microsoft Issatso
          </span>
        </Link>

        {/* Right Section with Profile Dropdown */}
        <div className='flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse'>
          {/* Profile Dropdown Toggle */}
          <button
            type='button'
            className='flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
            aria-expanded={isDropdownOpen ? 'true' : 'false'}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown on click
          >
            <span className='sr-only'>Open user menu</span>

            {/* <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-lg text-white'>
              {user.nomPrenom ? getUserInitials() : ''}
            </div> */}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className='absolute right-10 top-16 z-50 my-4 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700'
              id='user-dropdown'
            >
              <div className='px-4 py-3'>
                <span className='block text-sm text-gray-900'>
                  {user?.nomPrenom}
                </span>
                <span className='block truncate text-sm text-gray-500'>
                  {user?.email}
                </span>
              </div>
              <ul className='py-2' aria-labelledby='user-menu-button'>
                <button
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white'
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </ul>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type='button'
            className='inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'
            aria-controls='navbar-user'
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle mobile menu
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='h-5 w-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 1h15M1 7h15M1 13h15'
              />
            </svg>
          </button>
        </div>

        {/* Main Navigation Links for Desktop and Mobile */}
        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } w-full items-center justify-between md:order-1 md:flex md:w-auto`}
          id='navbar-user'
        >
          <ul className='mt-4 flex flex-col justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-navbar md:p-0 md:dark:bg-gray-900 rtl:space-x-reverse'>
            <li>
              {user.role === 'member' ? (
                <Link
                  href='/member/'
                  className='block rounded px-3 py-2 text-black hover:bg-gray-100 dark:text-white md:p-0 md:text-gray-300 md:hover:bg-transparent md:hover:text-primary md:dark:hover:text-primary'
                >
                  Departments
                </Link>
              ) : (
                ''
              )}
            </li>
            <li>
              {user.role === 'superAdmin' ? (
                <Link
                  href='SuperAdmin/members'
                  className='block rounded px-3 py-2 text-black hover:bg-gray-100 dark:text-white md:p-0 md:text-gray-300 md:hover:bg-transparent md:hover:text-primary md:dark:hover:text-primary'
                >
                  Members
                </Link>
              ) : (
                <Link
                  href={
                    user.role === 'member'
                      ? '/member/sessions' + '?id_dep=' + currentDepartment
                      : '/instructor/sessions'
                  }
                  className='block rounded px-3 py-2 text-black hover:bg-gray-100 dark:text-white md:p-0 md:text-gray-300 md:hover:bg-transparent md:hover:text-primary md:dark:hover:text-primary'
                >
                  Sessions
                </Link>
              )}
            </li>
            <li>
              <Link
                href={
                  user.role === 'member'
                    ? '/member/assignments/' + '?id_dep=' + currentDepartment
                    : '/instructor/assignments'
                }
                className='block rounded px-3 py-2 text-black hover:bg-gray-100 dark:text-white md:p-0 md:text-gray-300 md:hover:bg-transparent md:hover:text-primary md:dark:hover:text-primary'
              >
                Assignments
              </Link>
            </li>
            <li>
              {user.role === 'instructor' ? (
                <Link
                  href='/instructor/showMembers'
                  className='block rounded px-3 py-2 text-black hover:bg-gray-100 dark:text-white md:p-0 md:text-gray-300 md:hover:bg-transparent md:hover:text-primary md:dark:hover:text-primary'
                >
                  Members
                </Link>
              ) : (
                ''
              )}
            </li>
            <li>
              {user.role === 'instructor' ? (
                <Link
                  href='/instructor/chats'
                  className='block rounded px-3 py-2 text-black hover:bg-gray-100 dark:text-white md:p-0 md:text-gray-300 md:hover:bg-transparent md:hover:text-primary md:dark:hover:text-primary'
                >
                  Chats
                </Link>
              ) : (
                ''
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
