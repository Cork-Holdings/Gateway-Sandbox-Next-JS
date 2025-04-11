import React from 'react'
import Image from 'next/image'
import MerchantSignInForm from '@/components/custom/forms/auth/merchant/SignInForm'


const SigninPage = () => {
  return (
    <div className='w-full h-screen flex items-start'>
            {/* The image section, visible only on large screens (lg) and above */}
            <div className='hidden lg:flex relative w-1/2 h-full flex-col'>
                <div className='absolute inset-0 bg-black opacity-50'></div>
                <div className='absolute top-[25%] left-[10%] flex flex-col'>
                    <h1 className='text-6xl text-white font-extrabold my-4'>GeePay SandBox</h1>
                    <p className='text-3xl text-white font-bold'>Merchant Portal</p>
                </div>
                <Image 
                width={1000}
                height={1000}
                src={"/images/merchant-signin.jpg"} alt='Work Icon' className='w-full h-full object-cover' />
            </div>

            {/* The form section, takes full width on small/medium screens, half on large screens */}
            <div className='w-full lg:w-1/2 h-full  flex flex-col p-20 justify-between'>
                <h1 className='text-xl text-black font-semibold'></h1>

                <div className='w-full flex flex-col'>
             <MerchantSignInForm /> 
                </div>
                <div className='w-full'>
                    <p className='hidden'>Rand</p>
                </div>
            </div>
        </div>
  )
}

export default SigninPage