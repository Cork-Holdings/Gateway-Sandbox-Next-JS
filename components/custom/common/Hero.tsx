"use client"
import { Button } from '@/components/ui/button'
import { ArrowRight, Code } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Hero = () => {



  const router = useRouter()
  return (
    <section className="relative bg-gradient-to-r from-[#00AEEF] to-indigo-800 text-white">
      <div className="absolute inset-0 bg-[url(/api/placeholder/1200/600)] opacity-10 bg-cover bg-center"></div>
      <div className="container mx-auto px-4 max-w-5xl py-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6  md:pr-20">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Payment Gateway
              <span className="block text-[#3C3C8C]">API Sandbox</span>
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
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
          <div className="flex-1 relative h-64 md:h-96 w-full">
            <div className="absolute -top-6 -left-6 w-full h-full bg-[#3C3C8C] rounded-lg"></div>
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-blue-400 opacity-50 rounded-lg"></div>
            <div className="relative h-full w-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
              <Image src="/images/Coding workshop-pana.png" alt="API Dashboard Preview" width={600} height={400} className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#ffffff" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#ffffff" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>

  )
}

export default Hero