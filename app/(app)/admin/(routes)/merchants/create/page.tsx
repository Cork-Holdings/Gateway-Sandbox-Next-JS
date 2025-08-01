"use client"
import CreateMerchantForm from '@/components/custom/forms/admin/merchants/create-merchant-form'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const CreateMerchant = () => {

  const router = useRouter()
  return (
    <main className='flex flex-col gap-3 m-8 max-w-6xl mx-auto'>
      <div>
      <Button
      onClick={()=> router.back()}
      >Back</Button>
      </div>
    
      <CreateMerchantForm/>
    </main>
  )
}

export default CreateMerchant