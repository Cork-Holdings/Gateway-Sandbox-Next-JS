import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api_endpoints, next_url } from '@/utils/api_constants'
import React, { useState } from 'react'
import { Loader2, Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CheckoutSessionDocumentationContainer from '../documentation/checkout_session_documentation_container'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

const CheckoutSessionContainer = () => {
  const [clientId, setClientId] = useState('')
  const [transactionReference, setTransactionReference] = useState('')
  const [accepted, setAccepted] = useState('')
  const [contentType, setContentType] = useState('')
  const [orderId, setOrderID] = useState('')
  const [amount, setAmount] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [returnUrl, setReturnUrl] = useState('')
  const [token, setToken] = useState('')

  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const makeRequest = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResponse(null)

      const body = {
        checkout_base_url: `https://${next_url}/merchant/hosted-checkout/`,
        order_id: orderId || "",
        amount: Number(amount) || "",
        customer: {
          name: customerName || "",
          email: customerEmail || ""
        },
          return: returnUrl || "",
      }

      const apiResponse = await fetch(api_endpoints.merchant.makeAddCheckoutRequest, {
        method: "POST",
        headers: {
          'Content-Type': contentType,
          'Accept': accepted,
          'Authorization': `Bearer ${token}`,
          "X-Client-Id": clientId,
          "X-Transaction-Ref":transactionReference
        },
        body: JSON.stringify(body)
      })

      const data = await apiResponse.json()

       await new Promise(resolve => setTimeout(resolve, 4000))

      if (apiResponse.ok) {
        setResponse(data)
      } else {
        setResponse(data)
        throw new Error(data.message || 'Request failed')
      }
    } 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {

      //   setError( 'An error occurred while making the request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className='flex flex-col lg:flex-row gap-8  bg-gray-100 dark:bg-inherit p-6'>
      <div className="max-w-4xl w-full">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold dark:text-white">API Execution Sandbox</CardTitle>
            <p className="text-sm text-gray-500 dark:text-white">Create Hosted Checkout URL Endpoint</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className='space-y-2'>
              <Label className="text-lg font-medium">
                Request Headers
              </Label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>


                <div className='space-y-2'>

                  <Label htmlFor="token" className="text-sm font-medium flex items-center gap-1">
                    Bearer Token
                    <Badge variant="outline" className="ml-1 font-normal">Required</Badge>

                  </Label>
                  <Textarea
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter Token"
                    disabled={isLoading}
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                <div className='space-y-2'>

                  <Label htmlFor="xclientId" className="text-sm font-medium flex items-center gap-1">
                    X-Client-ID
                    <Badge variant="outline" className="ml-1 font-normal">Required</Badge>

                  </Label>
                  <Input
                    id="xclientId"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter your client ID"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="contentType" className="text-sm font-medium flex items-center gap-1">
                    Content-Type
                    <Badge variant="outline" className="ml-1 font-normal">Required</Badge>

                  </Label>
                  <Input
                    id="contentType"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    placeholder="Enter your Content-Type"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>


                <div className='space-y-2'>

                  <Label htmlFor="xtref" className="text-sm font-medium flex items-center gap-1">
                    X-Transaction-Ref
                    <Badge variant="outline" className="ml-1 font-normal">Required</Badge>

                  </Label>
                  <Input
                    id="xtref"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    placeholder="Enter your Transaction Reference"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>


                <div className='space-y-2'>

                  <Label htmlFor="acceptType" className="text-sm font-medium flex items-center gap-1">
                    Accept
                    <Badge variant="outline" className="ml-1 font-normal">Required</Badge>

                  </Label>
                  <Input
                    id="acceptType"
                    value={accepted}
                    onChange={(e) => setAccepted(e.target.value)}
                    placeholder="Enter the accepted data type"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

              </div>

              <Label className="text-lg font-medium">
                Request Body
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div>
                  <Label htmlFor="orderId" className="text-sm font-medium flex items-center gap-1">
                    Order ID
                    <Badge variant="outline" className="ml-1 font-normal">Not required</Badge>

                  </Label>
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderID(e.target.value)}
                    placeholder="Enter your Order ID"
                    disabled={isLoading}
                    className="mt-1"
                    type="text"
                  />
                </div>

                <div>
                  <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-1">
                    Amount
                    <Badge variant="outline" className="ml-1 font-normal">Not required</Badge>

                  </Label>
                  <Input
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter your client secret"
                    type="number"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                    Customer Name
                    <Badge variant="outline" className="ml-1 font-normal">Not required</Badge>

                  </Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your customer name"
                    type="text"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                    Customer Email
                    <Badge variant="outline" className="ml-1 font-normal">Not required</Badge>

                  </Label>
                  <Input
                    id="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                    type="text"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="surl" className="text-sm font-medium flex items-center gap-1">
                    Return URL
                    <Badge variant="outline" className="ml-1 font-normal">Not required</Badge>

                  </Label>
                  <Input
                    id="surl"
                    value={returnUrl}
                    onChange={(e) => setReturnUrl(e.target.value)}
                    placeholder="Enter your return URL"
                    type="text"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                
              </div>

              <Button
                onClick={makeRequest}
                disabled={isLoading || !clientId || !transactionReference}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  'Execute Request'
                )}
              </Button>
            </div>

            {/* Response Section */}
            {(response || error) && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {response ? 'Response' : 'Error'}
                  </h3>
                  {response && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {response && (
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      padding: '1rem',
                      borderRadius: '0.375rem',
                      maxHeight: '400px',
                      overflow: 'auto'
                    }}
                  >
                    {JSON.stringify(response, null, 2)}
                  </SyntaxHighlighter>
                )}

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Details */}
        <Card className="max-w-2xl mx-auto mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm overflow-auto whitespace-pre-wrap break-words">
              <p><strong>Endpoint:</strong> {api_endpoints.merchant.makeAddCheckoutRequest}</p>
              <p><strong>Method:</strong> POST</p>
              <p><strong>Headers:</strong></p>
              <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ padding: '1rem', borderRadius: '0.375rem' }}>
                {JSON.stringify(
                  {
                    "Content-Type": contentType || '[Content-Type]',
                    "Accept": accepted || '[Accept]',
                    "X-Client-ID": clientId || '[X-Client-ID]',
                    "Authorization": token ? `Bearer ${token}` : '[Authorization Token]',
                    "X-Transaction-Ref": transactionReference || '[X-Transaction-Ref]'
                  },
                  null,
                  2
                )}
              </SyntaxHighlighter>

              <p><strong>Payload (Request Body):</strong></p>
              <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ padding: '1rem', borderRadius: '0.375rem' }}>
                {JSON.stringify(
                  {
                    "order_id": orderId || '[order_id]',
                    "amount": Number(amount) || '[amount]',
                    "customer_name": customerName || '[customer_name]',
                    "customer_email": customerEmail || '[customer_email]',
                    "return_url": returnUrl || '[return_url]',
                    
                  },
                  null,
                  2
                )}
              </SyntaxHighlighter> </div>
          </CardContent>
        </Card>
      </div>

      <CheckoutSessionDocumentationContainer />
    </main>
  )
}

export default CheckoutSessionContainer