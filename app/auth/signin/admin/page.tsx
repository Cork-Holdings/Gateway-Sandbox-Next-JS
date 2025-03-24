import React from 'react'
import Image from 'next/image'
import AdminSignInForm from '@/components/custom/forms/auth/backoffice/SignInForm'


const SigninPage = () => {
  return (
    <div className='w-full h-screen flex items-start'>
            {/* The image section, visible only on large screens (lg) and above */}
            <div className='hidden lg:flex relative w-1/2 h-full flex-col'>
                <div className='absolute inset-0 bg-black opacity-30'></div>
                <div className='absolute top-[25%] left-[10%] flex flex-col'>
                    <h1 className='text-6xl text-white font-extrabold my-4'>Geepay Sandbox</h1>
                    <p className='text-3xl text-white font-bold'>Admin Portal!</p>
                </div>
                <Image src={"/images/coding.jpg"} 
                alt='Work Icon'
                 className='w-full h-full object-cover' 
                 width={1000}
                 height={1000}
                 />
            </div>

            {/* The form section, takes full width on small/medium screens, half on large screens */}
            <div className='w-full lg:w-1/2 h-full flex flex-col p-20 justify-between'>
                <h1 className='text-xl text-[#ffffff] font-semibold'></h1>

                <div className='w-full flex flex-col'>
             <AdminSignInForm /> 
                </div>
                <div className='w-full'>
                    <p className='hidden'>Rand</p>
                </div>
            </div>
        </div>
  )
}

export default SigninPage