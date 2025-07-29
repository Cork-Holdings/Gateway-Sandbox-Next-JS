import { CardContent, Card } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

const About = () => {
  return (
    <section className="py-20 bg-white dark:bg-[#00AEEF] border-b-1">
      <div className="container mx-auto px-4 max-w-5xl text-start">
        <Card className="p-0 rounded-lg shadow-xl">
          <CardContent className="flex flex-col md:flex-row p-0 gap-4 md:gap-2 items-center">
            <div className="w-full md:w-1/2 h-52 bg-[#3C3C8C] flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
              <Image
                src="/images/GEEPAY-LOGO(main-white).png"
                alt="GeePay logo"
                height={50}
                width={230}
                className="h-auto w-[180px] md:w-[230px]"
              />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-8 text-center flex flex-col gap-3">
              <p className="text-xl md:text-2xl font-bold text-[#00AEEF]">GeePay</p>
              <p className="text-sm md:text-base font-semibold">
                At Geepay, we are revolutionizing the way you move money—fast, secure, and simple. Whether you are a business or an individual, our payment solutions ensure seamless transactions every time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default About
