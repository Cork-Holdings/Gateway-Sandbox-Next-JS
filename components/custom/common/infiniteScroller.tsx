'use client';

import React from 'react';
import Image from 'next/image';

interface LogoScrollerProps {
  logos: { src: string; alt: string }[];
  speed?: number; // Speed in seconds
}

export const InfiniteLogoScroller: React.FC<LogoScrollerProps> = ({
  logos,
  speed = 30,
}) => {
  return (
    <div className="relative overflow-hidden py-10 md:py-32">
     <div className='dark:text-white text-black text-center mb-10 text-3xl space-y-2'>
       <p className='text-white'>Our Ecosystem</p>
      <p className='text-lg text-white'>Join a community of financial instituitions and developers</p>
     </div>
      <div className="flex whitespace-nowrap">
        <div
          className="flex animate-marquee"
          style={{
            animationDuration: `${speed}s`,
          }}
        >
          {/* First sequence */}
          {logos.map((logo, index) => (
            <div key={`logo-1-${index}`} className="mx-8 flex-shrink-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={70}
                className="object-contain w-[100px] h-[70px]"
              />
            </div>
          ))}

          {/* Second identical sequence */}
          {logos.map((logo, index) => (
            <div key={`logo-2-${index}`} className="mx-8 flex-shrink-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={70}
                className="object-contain w-[100px] h-[70px]"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
};