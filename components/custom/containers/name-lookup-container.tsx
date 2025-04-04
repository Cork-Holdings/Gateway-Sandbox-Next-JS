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
import NameLookupDocumentationContainer from '../documentation/name_lookup_documentation'

const NameLookupContainer = () => {
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState('')
  const [contentType, setContentType] = useState('')
  const [acceptType, setAcceptType] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const url = `${api_endpoints.merchant.makeNameLookupRequest}/${phoneNumber}`;
  const makeRequest = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResponse(null)


      const apiResponse = await fetch(url, {
        headers: {
          'Content-Type': contentType,
          'Accept': acceptType,
          "Authorization": `Bearer ${token}`,
            },

      })

      const data = await apiResponse.json()

      if (apiResponse.ok) {
        setResponse(data)
      } else {
        setResponse(data)
        throw new Error(data.message || 'Request failed')
      }
    } catch (err) {

    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    if (!response) return null;

    
    const code = response["code"];

    if (code == 200) {
      return <Badge className="bg-green-500 hover:bg-green-600">Success - 200</Badge>;
    } else {
      return <Badge className="bg-red-500 hover:bg-red-600">Error - {code || "Unknown"}</Badge>;
    }
  };

  const handleCopy = (text:string) => {
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
            <p className="text-sm text-gray-500">Name Look Up</p>
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

                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                 Phone Number
                  <Badge variant="outline" className="ml-1 font-normal">Required</Badge>
                </Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your Phone Number"
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
              <p><strong>Endpoint:</strong>{` ${url}`}</p>
              <p><strong>Method:</strong> GET</p>

              <p><strong>Headers:</strong></p>
              <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ padding: '1rem', borderRadius: '0.375rem' }}>
                {JSON.stringify(
                  {
                    "Content-Type": contentType || '[Content-Type]',
                    "Accept": acceptType || '[Accept]',
                    "Authorization": token ? `Bearer ${token}` : '[Authorization Token]',
                  },
                  null,
                  2
                )}
              </SyntaxHighlighter>

              
            </div>
          </CardContent>
        </Card>
      </div>

      <NameLookupDocumentationContainer />
    </main>
  )
}

export default NameLookupContainer