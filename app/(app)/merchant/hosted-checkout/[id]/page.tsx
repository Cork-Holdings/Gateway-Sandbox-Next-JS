"use client"

import HostedCheckoutForm from '@/components/custom/forms/merchant/hosted-checkout-form'
import { api_endpoints } from '@/utils/api_constants'
import { HDetails } from '@/utils/types/HostedCheckout'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ShieldCheck, AlertCircle, RefreshCw, Smartphone, CreditCard } from 'lucide-react'

const HostedCheckoutPage = () => {
  const { id } = useParams()
  const [hDetails, setHDetails] = useState<HDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCheckoutDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`${api_endpoints.merchant.makeGetCheckoutDetailsRequest}/${id}`)
      const data = await response.json()

      if (data.status === "success") {
        const res = data.response;
        setHDetails({
          order_id: res.order_id,
          amount: res.amount,
          customer_name: res.customer?.name || "",
          customer_email: res.customer?.email || "",
          checkout_url: res.checkout_url,
          return_url: res.return_url,
        });
      } else {
        setError("Unable to retrieve valid transaction details. Please check the checkout link.")
      }
    } catch (err) {
      setError("A connection error occurred while loading your checkout session.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchCheckoutDetails()
  }, [id])

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto space-y-6">

          {/* Top Logo / Branding Area (Optional Context) */}
          <div className="flex flex-col items-center space-y-2 mb-2">
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200/50">
              <ShieldCheck className="w-4 h-4" /> Secure 256-bit Encrypted Session
            </div>
          </div>

          {/* LOADING STATE SKELETON */}
          {isLoading && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border p-8 space-y-6 animate-pulse">
              <div className="space-y-3 flex flex-col items-center">
                <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                </div>
                <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-red-100 dark:border-red-950/50 p-8 text-center space-y-4">
              <div className="inline-flex p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Checkout Error</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto whitespace-pre-line">{error}</p>
              <button
                onClick={fetchCheckoutDetails}
                className="inline-flex items-center gap-2 text-sm bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" /> Retry Connection
              </button>
            </div>
          )}

          {/* SUCCESSFUL LOADED FORM CONTAINER */}
          {!isLoading && !error && hDetails && (
            <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
              <HostedCheckoutForm details={hDetails} />
            </div>
          )}

          {/* Footer Security Badges */}
          {!isLoading && !error && (
            <div className="flex flex-col items-center justify-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-4 border-b pb-3 border-slate-200 dark:border-slate-800 w-full justify-center">
                <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Mobile Money Supported</span>
                <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Card Processing Ready</span>
              </div>
              <p className="pt-1">© {new Date().getFullYear()} Secure Payment Gateway. All rights reserved.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default HostedCheckoutPage