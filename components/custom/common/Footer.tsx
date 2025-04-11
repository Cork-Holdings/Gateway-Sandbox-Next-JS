import React from 'react'
import Image from 'next/image'
import { FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#00AEEF] to-[#3C3C8C] text-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <Image
            src={'/images/logo1.png'}
            alt='Sandbox Logo'
            width={100}
            height={100}
            className=''
          />
          <p className='text-xl font-bold'>GeePay Sandbox</p>

        </div>
          <div>
            <h3 className="text-white font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#documentation" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
          </div>
          {/* <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#Geepay Site" className="hover:text-white transition-colors">About</a></li>
            </ul>
          </div> */}

        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © {new Date().getFullYear()} GeePay Payment Gateway Sandbox. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/company/geepay/" className="text-gray-400 hover:text-white transition-colors">
             <FaLinkedin/>
            </a>
            <a href="https://x.com/mygeepay?s=11" className="text-gray-400 hover:text-white transition-colors">
              <FaTwitter/>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer