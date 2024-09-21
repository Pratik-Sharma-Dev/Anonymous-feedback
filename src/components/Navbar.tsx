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
                    Anonymous message
                </Link>
                {
                    session ? (
                        <>
                            <Link href={'/dashboard'}><span className='mr-4'>Welcome, {user?.username || user?.email || 'Guest'}</span></Link>
                            <button 
                                className='w-full md:w-auto bg-blue-500 text-white p-2 rounded' 
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
                                className='w-full md:w-auto bg-blue-500 text-white p-2 rounded' 
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
