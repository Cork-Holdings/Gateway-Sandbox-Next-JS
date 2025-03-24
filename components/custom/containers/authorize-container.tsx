import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api_endpoints } from '@/utils/api_constants'
import React, { useState } from 'react'
import { Loader2, Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const AuthorizeContainer = () => {
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
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
        client_id: clientId,
        client_secret: clientSecret,
      }

      const apiResponse = await fetch(api_endpoints.merchant.makeAuthorizationRequest, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
    } catch (err) {
        
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
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">API Execution Sandbox</CardTitle>
          <p className="text-sm text-gray-500">Merchant Authorization Endpoint</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Inputs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientId" className="text-sm font-medium">
                Client ID
              </Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your client ID"
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="clientSecret" className="text-sm font-medium">
                Client Secret
              </Label>
              <Input
                id="clientSecret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Enter your client secret"
                type="password"
                disabled={isLoading}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={makeRequest} 
              disabled={isLoading || !clientId || !clientSecret}
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
          <div className="space-y-2 text-sm">
            <p><strong>Endpoint:</strong> {api_endpoints.merchant.makeAuthorizationRequest}</p>
            <p><strong>Method:</strong> POST</p>
            <p><strong>Payload:</strong></p>
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                padding: '1rem',
                borderRadius: '0.375rem'
              }}
            >
              {JSON.stringify({ client_id: clientId || '[client_id]', client_secret: clientSecret || '[client_secret]' }, null, 2)}
            </SyntaxHighlighter>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthorizeContainer