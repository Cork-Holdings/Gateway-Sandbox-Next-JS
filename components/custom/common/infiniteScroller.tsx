'use client';

import React from 'react';
import Image from 'next/image';

interface LogoScrollerProps {
    logos: { src: string; alt: string }[];
    speed?: number; // Speed in seconds
}

export const InfiniteLogoScroller: React.FC<LogoScrollerProps> = ({ logos, speed = 30 }) => {
    const duplicatedLogos = [...logos, ...logos]; // Duplicate for seamless looping

    return (
        <div className="overflow-hidden whitespace-nowrap py-10 md:py-32">
            <div
                className="flex animate-scroll"
                style={{
                    animationDuration: `${speed}s`,
                }}
            >
                {duplicatedLogos.map((logo, index) => (
                    <div key={index} className="mx-8 flex-shrink-0">
                        <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={300}
                            height={200}
                            className="object-contain w-[150px] h-[100px]"
                        />   </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
      `}</style>
        </div>
    );
};
