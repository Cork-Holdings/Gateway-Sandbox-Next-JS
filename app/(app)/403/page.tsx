"use client"
import { signOut } from 'next-auth/react'
import React, { useEffect } from 'react'

const UnAuthorized = () => {

  useEffect(()=>{

signOut({ callbackUrl: "/auth/signin/admin" })
  })
  return (
   <main className='h-screen w-full flex items-center justify-center'>
    <p className='text-3xl font-semibold'>403 | Unauthorized Access</p>
   </main>
  )
}

export default UnAuthorized