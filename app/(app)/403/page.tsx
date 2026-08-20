"use client"
import { getSession, signOut } from 'next-auth/react'
import React, { useEffect } from 'react'
import { signInPathForRole } from '@/utils/auth'

const UnAuthorized = () => {

  useEffect(() => {
    const redirectToSignIn = async () => {
      const session = await getSession()
      signOut({ callbackUrl: signInPathForRole(session?.role) })
    }

    redirectToSignIn()
  }, [])

  return (
   <main className='h-screen w-full flex items-center justify-center'>
    <p className='text-3xl font-semibold'>403 | Unauthorized Access</p>
   </main>
  )
}

export default UnAuthorized
