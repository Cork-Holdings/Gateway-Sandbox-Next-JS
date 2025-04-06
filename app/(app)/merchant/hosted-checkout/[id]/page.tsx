"use client"
import HostedCheckoutForm from '@/components/custom/forms/merchant/hosted-checkout-form'
import { api_endpoints } from '@/utils/api_constants'
import { HDetails } from '@/utils/types/HostedCheckout'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const HostedCheckoutPage = () => {

  const {id} = useParams()

  const [hDetails, setHDetails] = useState<HDetails | null>(null)


  const fetchCheckoutDetails = async () => {
    
    const response = await fetch(`${api_endpoints.merchant.makeGetCheckoutDetailsRequest}/${id}`)
  
  const data = await response.json()

  if (data.status == "success") { 
    const res = data.response;
    setHDetails({
      order_id: res.order_id,
      amount: res.amount,
      customer_name: res.customer.name,
      customer_email: res.customer.email,
      checkout_url: res.checkout_url,
      redirect_urls: res.redirect_urls,
    });
  }else  if (data.status=="failure"){

  }
  
  }

  useEffect(()=>{
    fetchCheckoutDetails()
  }, [id])



  return (
    <main>
    {hDetails ? (
      <HostedCheckoutForm details={hDetails} />
    ) : (
      <p className="text-center py-10">Loading checkout details...</p>
    )}
  </main>
  )
}

export default HostedCheckoutPage