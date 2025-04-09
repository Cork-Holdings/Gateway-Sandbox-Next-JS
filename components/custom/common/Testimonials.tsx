import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Trusted by Developers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The sandbox environment made our integration testing seamless. We identified edge cases we wouldn't have caught otherwise.",
                author: "Sarah Chen",
                role: "Lead Developer, TechStart"
              },
              {
                quote: "Documentation is thorough and the API responses exactly match production. This saved us weeks of debugging time.",
                author: "Miguel Rodriguez",
                role: "CTO, PayQuick"
              },
              {
                quote: "Being able to simulate different payment scenarios helped us build a robust checkout flow that handles all cases gracefully.",
                author: "Ava Johnson",
                role: "Engineering Manager, ShopWave"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 border-none">
                <CardContent className="pt-6">
                  <p className="italic text-gray-700 mb-6">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

  )
}

export default Testimonials