import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import React from 'react'

const CTA = () => {
  return (
    <section className="py-20 bg-blue-600 text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Create your sandbox account today and start building your payment integration with confidence.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black">
          Sign Up Free <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
          Contact Sales
        </Button>
      </div>
    </div>
  </section>
  )
}

export default CTA