import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Code,Coffee,TreePalm,  } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <section id='features' className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="container mx-auto px-4 text-start">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#00AEEF]">Why use the sandbox?</h2>
          <p className='font-semibold '>Made for developers, by developers</p>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-5">
          {[
            {
              icon: <Coffee className="h-10 w-10 text-[#3C3C8C]" />,
              title: "Developer Friendly",
              description: "Industry standard RESTful APIs with simple resourceful URLs, JSON responses, API Docs, & More."
            },


            {
              icon: <TreePalm className="h-10 w-10 text-[#3C3C8C]" />,
              title: "Isolated Testing",
              description: "Enables you to test independently of your merchant profile on the Payment gateway so that you can stay stress free."
            },
            {
              icon: <Code className="h-10 w-10 text-[#3C3C8C]" />,
              title: "API Explorer",
              description: "Interactive documentation that lets you make API calls directly from your browser."
            },

          ].map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

  )
}

export default Features