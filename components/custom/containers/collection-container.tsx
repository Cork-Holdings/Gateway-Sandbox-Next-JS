import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api_endpoints } from '@/utils/api_constants'
import React, { useState } from 'react'
import { Loader2, Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Textarea } from '@/components/ui/textarea'
import CollectionDocumentationContainer from '../documentation/collection_documentation'
import { Badge } from '@/components/ui/badge'

const CollectionContainer = () => {
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState('')
  const [contentType, setContentType] = useState('')
  const [acceptType, setAcceptType] = useState('')
  const [tRef, setTRef] = useState('')
  const [clientID, setClientID] = useState('')

  const makeRequest = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResponse(null)

      const body = {
        phone_number: phone,
        amount: amount,
      }

      const apiResponse = await fetch(api_endpoints.merchant.makeCollectionRequest, {
        method: "POST",
        headers: {
          'Content-Type': contentType,
          'Accept': acceptType,
          "X-Client-ID": clientID,
          "Authorization": `Bearer ${token}`,
          "X-Transaction-Ref": tRef
        },
        body: JSON.stringify(body)
      })

      const data = await apiResponse.json()

      if (apiResponse.ok) {
        setResponse(data)
      } else {
        setResponse(data)
        throw new Error(data.message || 'Request failed')
      }
    } 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {

    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    if (!response) return null;
    
    
    const code = response["code"];
    if (code === 200) {
      return <Badge className="bg-green-500 hover:bg-green-600">Success - 200</Badge>;
    } else if (code === 202) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Pending - 202</Badge>;
    } else {
      return <Badge className="bg-red-500 hover:bg-red-600">Error - {code || "Unknown"}</Badge>;
    }
  };

  const handleCopy = (text:string) => {
    console.log('text', text)
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className='flex flex-col lg:flex-row gap-8  bg-gray-100 p-6'>
      <div className="max-w-4xl w-full">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">API Execution Sandbox</CardTitle>
            <p className="text-sm text-gray-500">Request To Pay</p>
          </CardHeader>
          <CardContent className="space-y-6">

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
                  value={clientID}
                  onChange={(e) => setClientID(e.target.value)}
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
                  value={tRef}
                  onChange={(e) => setTRef(e.target.value)}
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
                  value={acceptType}
                  onChange={(e) => setAcceptType(e.target.value)}
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
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                  Phone
                  <Badge variant="outline" className="ml-1 font-normal">Required</Badge>
                
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your Phone Number"
                  disabled={isLoading}
                  className="mt-1"
                  type="text"
                />
              </div>

              <div>
                <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-1">
                  Amount
                  <Badge variant="outline" className="ml-1 font-normal">Required</Badge>
                
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

            </div>
            
            <Button
                onClick={makeRequest}
                disabled={isLoading}
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

            {/* Response Section */}
            {(response || error) && (
              <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Response</h3>
                  {getStatusBadge()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(JSON.stringify(response, null, 2))}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy JSON
                    </>
                  )}
                </Button>
              </div>
              
              {response && (
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  customStyle={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}
                >
                  {JSON.stringify(response, null, 2)}
                </SyntaxHighlighter>
              )}
              
              {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
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
            <div className="space-y-2 text-sm">
              <p><strong>Endpoint:</strong> {api_endpoints.merchant.makeAuthorizationRequest}</p>
              <p><strong>Method:</strong> POST</p>

              <p><strong>Headers:</strong></p>
              <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ padding: '1rem', borderRadius: '0.375rem' }}>
                {JSON.stringify(
                  {
                    "Content-Type": contentType || '[Content-Type]',
                    "Accept": acceptType || '[Accept]',
                    "X-Client-ID": clientID || '[X-Client-ID]',
                    "Authorization": token ? `Bearer ${token}` : '[Authorization Token]',
                    "X-Transaction-Ref": tRef || '[X-Transaction-Ref]'
                  },
                  null,
                  2
                )}
              </SyntaxHighlighter>

              <p><strong>Payload (Request Body):</strong></p>
              <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ padding: '1rem', borderRadius: '0.375rem' }}>
                {JSON.stringify(
                  {
                    "phone_number": phone || '[phone_number]',
                    "amount": amount || '[amount]'
                  },
                  null,
                  2
                )}
              </SyntaxHighlighter>
            </div>
          </CardContent>
        </Card>
      </div>

      <CollectionDocumentationContainer />
    </main>
  )
}

export default CollectionContainer