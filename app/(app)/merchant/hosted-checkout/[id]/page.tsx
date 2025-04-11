"use client"
import HostedCheckoutForm from '@/components/custom/forms/merchant/hosted-checkout-form'
import { api_endpoints } from '@/utils/api_constants'
import { HDetails } from '@/utils/types/HostedCheckout'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const HostedCheckoutPage = () => {
  const { id } = useParams()
  const [hDetails, setHDetails] = useState<HDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCheckoutDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${api_endpoints.merchant.makeGetCheckoutDetailsRequest}/${id}`)
      const data = await response.json()

      if (data.status === "success") { 
        const res = data.response;

        setHDetails({
          order_id: res.order_id,
          amount: res.amount,
          customer_name: res.customer.name,
          customer_email: res.customer.email,
          checkout_url: res.checkout_url,
          redirect_urls: res.redirect_urls,
        });
      } else if (data.status === "failure") {
        setError("Failed to load checkout details. Please try again.")
      }
    } catch (err) {
      setError(`An error occurred while loading checkout details.\n${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCheckoutDetails()
  }, [id])

  return (
    <main className="min-h-screen ">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-4">
              <h1 className="text-2xl font-bold text-white text-center">Secure Checkout</h1>
            </div>
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading checkout details...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 m-6">
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={fetchCheckoutDetails}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {!isLoading && !error && hDetails && (
              <div className="p-6">
                <HostedCheckoutForm details={hDetails} />
              </div>
            )}
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Secure Payment Gateway</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HostedCheckoutPage