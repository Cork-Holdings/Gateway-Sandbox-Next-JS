"use client"
import React from 'react'
import { FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Separator } from '@/components/ui/separator'
import {  ChevronsUp, Codesandbox, UserRoundPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Footer = () => {
  const router = useRouter()
  return (
    <>
      {/* CTA Footer Section */}
      <section className="bg-[#F87060] text-[#102542] rounded-t-3xl -mt-6 relative">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-20 px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Begin Development in Minutes</h2>
          <p className="text-lg mb-12 max-w-2xl">
            Launch, simulate, and iterate fast with GeePay&apos;s developer-first payment sandbox. Whether you&apos;re integrating, testing, or demoing — we&apos;ve built it for speed and flexibility.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-left">
            <div className="flex flex-col items-start shadow-2xl p-5 rounded-2xl">
              <UserRoundPlus size={48} />
              <Separator className="my-4 w-full" />
              <h3 className="text-xl font-semibold mb-2">Connect with Us</h3>
              <p className="text-sm mb-4">
                Stay in the loop with updates, releases, and community discussions. Follow us on social.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/company/geepay/"
                  className="text-[#102542] hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://x.com/mygeepay?s=11"
                  className="text-[#102542] hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter size={24} />
                </a>
              </div>
            </div>

            <div className="flex flex-col items-start shadow-2xl p-5 rounded-2xl">
              <Codesandbox size={48} />
              <Separator className="my-4 w-full" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Simulation</h3>
              <p className="text-sm">
                Utilize our robust sandbox environment to prototype and validate your payment logic before going live.
              </p>
            </div>

            <div className="flex flex-col items-start shadow-2xl p-5 rounded-2xl">
              <ChevronsUp size={48} />
              <Separator className="my-4 w-full" />
              <h3 className="text-xl font-semibold mb-2">Rapid Integration</h3>
              <p className="text-sm">
                Start building with our intuitive APIs and detailed documentation—no lengthy onboarding required.
              </p>
            </div>
          </div>

          <div className='pt-10 space-y-5 flex flex-col items-center'>
             <Button 
             variant="outline"
                        onClick={()=>router.push("/auth/signup")}
                         className=" hover:bg-[#3C3C8C]  hover:text-white w-fit">
                            Sign Up Free
                        </Button>
             <span >© {new Date().getFullYear()} GeePay Payment Gateway Sandbox. All rights reserved.</span>
       
          </div>
           
        </div>
          
      </section>

          </>
  )
}

export default Footer
