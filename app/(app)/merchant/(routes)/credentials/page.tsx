"use client"
import APICredentialsForm from '@/components/custom/forms/merchant/api-credentials'
import OAuthSignatureForm from '@/components/custom/forms/merchant/oauth-signature-form'
import PinConfigurationForm from '@/components/custom/forms/merchant/pin-configuration-form'
import UpdateFloatForm from '@/components/custom/forms/merchant/update-float-form'
import { api_endpoints } from '@/utils/api_constants'
import { Loader2 } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Configure = () => {

  // const {data:session} = useSession()

  const [clientID, setClientID] = useState<string>('')
  const [clientSecret, setClientSecret] = useState<string>('')
  const [clientSignature, setClientSignature] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [float, setFloat] = useState<string>('')

  const { data: session, } = useSession();

  const fetchAPIcreds = async () => {
    setLoading(true);

    try {

      const url = `${api_endpoints.common.getAPIcredentials}/${session?.id}`


      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${session?.accessToken}`
        }
      })

      const data = await response.json()

      if (response.status  ==  401){
        signOut({ callbackUrl: "/auth/signin/admin" })
      }

      if (data.status == "success") {
        setClientID(data.credentials.clientID)
        setClientSecret(data.credentials.clientSecret)
        setClientSignature(data.credentials.clientSignature)
        setFloat(data.credentials.float_balance)

      } 
      
      else if (data.status == "failure") {
        toast.error(`Unable to fetch client credentials\n${data.detail}`)
      }

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      toast.error("Something went wrong.Try Again.")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    if (session?.id) {
      fetchAPIcreds();
    }
  }, [session?.id]); // Now it depends on session.id, and only runs when it changes.



  if (loading) {
    return (
      <main className='h-screen w-full flex items-center justify-center'>
        <Loader2 className='h-10 w-10 animate-spin' />
      </main>
    );
  }

  return (
    <main className='flex flex-col items-center gap-8'>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">API Credentials</h1>
        <p className="text-gray-700">Manage your API credentials below. Ensure your credentials are stored securely.</p>
      </div>
      <div className='flex flex-col lg:flex-row w-full gap-8 items-start justify-between'>
        <APICredentialsForm clientID={clientID} clientSecret={clientSecret} />
        <OAuthSignatureForm signature={clientSignature} />

      </div>

      <div className='flex flex-col  lg:flex-row w-full gap-8 items-start justify-between'>
        <PinConfigurationForm />
        <UpdateFloatForm currentFloat={float} />
      </div>

    </main>
  )
}

export default Configure