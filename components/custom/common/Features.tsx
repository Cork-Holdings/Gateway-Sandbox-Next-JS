import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Code, Coffee, TreePalm } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <section id='features' className="min-w-[70vh] relative rounded-b-3xl overflow-hidden">
      <img
        src='/images/4.jpg'
        alt=''
        className='absolute h-full w-full object-cover'
      />
      <div className='absolute bg-gradient-to-br from-black/40 via-black/30 to-black/50 inset-0'></div>

      <div className="relative container py-24 mx-auto px-4 max-w-7xl">
        <div className="container mx-auto px-4 text-start mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#00AEEF] drop-shadow-lg">
            Why use the sandbox?
          </h2>
          <p className='text-lg font-medium text-white/90 drop-shadow-md'>
            Made for developers, by developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Coffee className="h-12 w-12 text-[#00AEEF]" />,
              title: "Developer Friendly",
              description: "Industry standard RESTful APIs with simple resourceful URLs, JSON responses, API Docs, & More.",
              isColored: false,
              gradient: "from-blue-500/10 to-cyan-500/10"
            },
            {
              icon: <TreePalm className="h-12 w-12 text-[#F87060]" />,
              title: "Isolated Testing",
              description: "Enables you to test independently of your merchant profile on the Payment gateway so that you can stay stress free.",
              isColored: true,
              gradient: "from-orange-500/10 to-red-500/10"
            },
            {
              icon: <Code className="h-12 w-12 text-[#3C3C8C]" />,
              title: "API Explorer",
              description: "Interactive documentation that lets you make API calls directly from your browser.",
              isColored: false,
              gradient: "from-purple-500/10 to-indigo-500/10"
            },
          ].map((feature, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden backdrop-blur-sm bg-white/95 hover:bg-white border-0 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${
                feature.isColored 
                  ? "ring-2 ring-[#F87060]/50 shadow-lg shadow-[#F87060]/20" 
                  : "shadow-lg shadow-black/10 hover:ring-2 hover:ring-[#00AEEF]/30"
              }`}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="mb-6 p-3 rounded-xl bg-gray-50 group-hover:bg-white transition-colors duration-300 w-fit group-hover:scale-110 transform transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed transition-colors duration-300">
                  {feature.description}
                </p>
                
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features