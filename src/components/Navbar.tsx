'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@react-email/components'

function Navbar() {
    const {data : session} = useSession();
    const user : User = session?.user as User; // assertion as user

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container flex mx-auto flex-col md:flex-row justify-between items-center'>
                <a className='text-xl font-bold mb-4 md:m-0' href="#">Anonymous message</a>
                {
                    session ? (
                        <>
                        <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                        <Button className='w-full md:will-change-auto' onClick={() => signOut()}>Logout</Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className='w-full md:will-change-auto' >Login</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar