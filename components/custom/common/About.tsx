import { Button } from '@/components/ui/button'
import { CardContent, Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const About = () => {
  return (
    <section className="py-20 bg-white ">
      <div className="container mx-auto px-4 max-w-4xl text-start">
        <Card className='p-0 rounded-lg shadow-xl'>
          <CardContent className='w-full p-0 flex gap-2 h-52 items-center'>
            <div className='w-1/2 h-full bg-[#3C3C8C] flex items-center justify-center rounded-lg'>
              <Image
                src={'/images/GEEPAY-LOGO(main-white).png'}
                alt='GeePay logo'
                height={100}
                width={100}
                className='h-[50px] w-[230px]'

              />
            </div>
            <div className='w-1/2 p-8 text-center flex flex-col gap-3'>
              <p className='text-2xl font-bold text-[#00AEEF]'>GeePay</p>
              <p className='font-semibold'>At Geepay, we are revolutionizing the way you move money—fast, secure, and simple. Whether you are a business or an individual, our payment solutions ensure seamless transactions every time.</p>
            </div>


          </CardContent>
        </Card>

      </div>
    </section>
  )
}

export default About