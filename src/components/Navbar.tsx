'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'

function Navbar() {
    const { data: session } = useSession();
    const user: User | undefined = session?.user as User; // Assertion with fallback

    return (
        <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
            <div className='container flex mx-auto flex-col md:flex-row justify-between items-center'>
                {/* Using Link without nesting <a> */}
                <Link href="/" className='text-xl font-bold mb-4 md:mb-0'>
                Anonymous Feedback
                </Link>
                {
                    session ? (
                        <>
                            <Link href={'/dashboard'}><span className='mr-4'>Welcome, {user?.username?.[0].toUpperCase() + user?.username?.slice(1)!  || user?.email || 'Guest'}</span></Link>
                            <button 
                                className='w-full md:w-auto bg-[#f1f5f9] text-gray-900 font-bold py-2 px-3 rounded' 
                                onClick={() => signOut()} 
                                aria-label="Logout"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // Use Link directly with a custom button as a child
                        <Link href="/sign-in">
                            <button 
                                className='w-full md:w-auto bg-[#f1f5f9] text-gray-900 py-2 px-3 font-bold rounded' 
                                aria-label="Login"
                            >
                                Login
                            </button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
