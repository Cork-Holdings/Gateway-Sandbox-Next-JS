"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Code } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { InfiniteLogoScroller } from './infiniteScroller'

const logos = [
  { src: '/images/airtel.png', alt: 'Airtel' },
  { src: '/images/mtn.png', alt: 'MTN' },
  { src: '/images/zamtel_logo.png', alt: 'Zamtel' },
  { src: '/images/gpay_logo_transaparent.png', alt: 'GeePay' },
  { src: '/images/VISA-Logo-2006.png', alt: 'Visa' },
  { src: '/images/mastercard-logo.png', alt: 'Mastercard' },
  { src: '/images/airtel.png', alt: 'Airtel' },
  { src: '/images/mtn.png', alt: 'MTN' },
  { src: '/images/zamtel_logo.png', alt: 'Zamtel' },
  { src: '/images/gpay_logo_transaparent.png', alt: 'GeePay' },
  { src: '/images/VISA-Logo-2006.png', alt: 'Visa' },
  { src: '/images/mastercard-logo.png', alt: 'Mastercard' },
  { src: '/images/airtel.png', alt: 'Airtel' },
  { src: '/images/mtn.png', alt: 'MTN' },
  { src: '/images/zamtel_logo.png', alt: 'Zamtel' },
  { src: '/images/gpay_logo_transaparent.png', alt: 'GeePay' },
  { src: '/images/VISA-Logo-2006.png', alt: 'Visa' },
  { src: '/images/mastercard-logo.png', alt: 'Mastercard' },
  { src: '/images/airtel.png', alt: 'Airtel' },
  { src: '/images/mtn.png', alt: 'MTN' },
  { src: '/images/zamtel_logo.png', alt: 'Zamtel' },
  { src: '/images/gpay_logo_transaparent.png', alt: 'GeePay' },
  { src: '/images/VISA-Logo-2006.png', alt: 'Visa' },
  { src: '/images/mastercard-logo.png', alt: 'Mastercard' },
  


];

const Hero = () => {
  const router = useRouter()
  return (
    <main className='relative min-h-[100vh]'>
      <img
        alt=''
        src='/images/3.jpg'
        className='absolute h-full w-full '
      />
      <div className="absolute inset-0 z-10 h-full w-full bg-black/30 backdrop-blur-xs"></div>

      <div className="container mx-auto px-4 max-w-7xl pt-24 pb-10 relative inset-0 z-10">
        <div className="flex flex-col  gap-12 items-center justify-center">
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center  text-white">
              Payment Gateway
              <span className="block text-white">API Sandbox</span>
            </h1>
            <p className="text-xl opacity-90 max-w-2xl text-white">
              Test your integration in a secure environment with our powerful, developer-friendly sandbox. Build with confidence, deploy with ease.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={() => router.push("/auth/signup")}
                size="lg" className="bg-[#00AEEF] hover:cursor-pointer hover:bg-[#3C3C8C] hover:text-white text-black">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a href="/files/GEEPAY API DOCUMENTATION.pdf" download>
                <Button
                  size="lg" variant="outline" className="hover:cursor-pointer border-white text-indigo-800 hover:bg-indigo-800 hover:text-white">
                  Documentation <Code className="ml-2 h-4 w-4" />
                </Button>
              </a>

            </div>


        </div>
        <InfiniteLogoScroller logos={logos} />
      </div>
    </main>
  )
}

export default Hero