
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
import { Badge } from '@/components/ui/badge'
import QueryDisbursementDocumentationContainer from '../documentation/query_disbursement_documentation_container'

const DisbursementStatusContainer = () => {
  const [authSignature, setAuthSignature] = useState('')
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState('')
  const [contentType, setContentType] = useState('')
  const [acceptType, setAcceptType] = useState('')
  const [tRef, setTRef] = useState('')
  const [clientID, setClientID] = useState('')

  const url = `${api_endpoints.merchant.makeQueryDisbursementRequest}/${tRef}`

  const makeRequest = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResponse(null)


      const apiResponse = await fetch(url, {
        headers: {
          'Content-Type': contentType,
          'Accept': acceptType,
          "X-Client-ID": clientID,
          "Authorization": `Bearer ${token}`,
          "X-Auth-Signature": authSignature,
        },
  
      })

      const data = await apiResponse.json()
         // Simulate 3 second delay
      await new Promise(resolve => setTimeout(resolve, 3000))



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
    if (code == 200) {
      return <Badge className="bg-green-500 hover:bg-green-600">Success - 200</Badge>;
    } else if (code == 202) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Pending - 202</Badge>;
    } else {
      return <Badge className="bg-red-500 hover:bg-red-600">Error - {code || "Unknown"}</Badge>;
    }
  };

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
        <Card className="max-w-4xl w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">API Execution Sandbox</CardTitle>
            <p className="text-sm text-gray-500">Query disbursement status</p>
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

              <div className='space-y-2'>

                <Label htmlFor="xauthSig" className="text-sm font-medium flex items-center gap-1">
                  X-Auth-Signature
                  <Badge variant="outline" className="ml-1 font-normal">Required</Badge>

                </Label>
                <Input
                  id="xauthSig"
                  value={authSignature}
                  onChange={(e) => setAuthSignature(e.target.value)}
                  placeholder="Enter your X-Auth-Signature"
                  disabled={isLoading}
                  className="mt-1"
                />
              </div>

            </div>

            <Label className="text-lg font-medium">
              Request Parameters
            </Label>


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
                    onClick={() => handleCopy()}
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
        <Card className="max-w-4xl w-full mx-auto mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Endpoint:</strong> {url}</p>
              <p><strong>Method:</strong> GET</p>

              <p><strong>Headers:</strong></p>
              <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ padding: '1rem', borderRadius: '0.375rem' }}>
                {JSON.stringify(
                  {
                    "Content-Type": contentType || '[Content-Type]',
                    "Accept": acceptType || '[Accept]',
                    "X-Client-ID": clientID || '[X-Client-ID]',
                    "Authorization": token ? `Bearer ${token}` : '[Authorization Token]',
                    "X-Auth-Signature": authSignature || '[X-Auth-Signature]',
                  },
                  null,
                  2
                )}
              </SyntaxHighlighter>

              <p><strong>Payload (Request Body):</strong></p>
              <p className='font-semibold'>No Request Body</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <QueryDisbursementDocumentationContainer />
    </main>
  )
}

export default DisbursementStatusContainer