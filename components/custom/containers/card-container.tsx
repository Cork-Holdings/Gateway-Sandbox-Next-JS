"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api_endpoints, next_url } from '@/utils/api_constants'
import React, { useEffect, useState } from 'react'
import { Loader2, Copy, Check, CheckCircle, AlertCircle, CreditCard } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import creditCardType from 'credit-card-type'
import { Alert, AlertDescription } from '@/components/ui/alert'

const CardContainer = () => {
  const [clientId, setClientId] = useState('')
  const [transactionReference, setTransactionReference] = useState('')
  const [accepted, setAccepted] = useState('')
  const [contentType, setContentType] = useState('')
  const [amount, setAmount] = useState('')
  const [token, setToken] = useState('')
  const [submitOtpLoading, setSubmitOtpLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolderName, setCardHolderName] = useState('')
  const [securityCode, setSecurityCode] = useState('')
  const [cardType, setCardType] = useState('')
  const [cardExpiryDate, setCardExpiryDate] = useState('')
  const [response, setResponse] = useState<{ message: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { data: session } = useSession()
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpVerificationStatus, setOtpVerificationStatus] = useState('')
  const [otpResponse, setOtpResponse] = useState(null)

  // Validation states
  const [cardNumberError, setCardNumberError] = useState('')
  const [cvvError, setCvvError] = useState('')
  const [expiryError, setExpiryError] = useState('')

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(' ') : cleaned
  }

  // Validate card number using Luhn algorithm
  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    if (cleaned.length < 13 || cleaned.length > 19) {
      return 'Card number must be between 13 and 19 digits'
    }

    // Luhn algorithm
    let sum = 0
    let isEven = false
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      isEven = !isEven
    }

    if (sum % 10 !== 0) {
      return 'Invalid card number'
    }
    return ''
  }

  // Validate CVV
  const validateCVV = (cvv: string, cardType: string) => {
    const isAmex = cardType === 'american-express'
    const expectedLength = isAmex ? 4 : 3

    if (cvv.length !== expectedLength) {
      return `CVV must be ${expectedLength} digits`
    }
    if (!/^\d+$/.test(cvv)) {
      return 'CVV must contain only numbers'
    }
    return ''
  }

  // Format and validate expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const validateExpiryDate = (expiry: string) => {
    if (expiry.length !== 5) {
      return 'Expiry date must be in MM/YY format'
    }

    const [month, year] = expiry.split('/')
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt('20' + year, 10)

    if (monthNum < 1 || monthNum > 12) {
      return 'Invalid month'
    }

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return 'Card has expired'
    }

    return ''
  }

  const detectCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '')
    const cardInfo = creditCardType(cleaned)
    if (cardInfo.length > 0) {
      setCardType(cardInfo[0].type)
    } else {
      setCardType('')
    }
  }

  useEffect(() => {
    const cleaned = cardNumber.replace(/\s/g, '')
    if (cleaned.length >= 13) {
      detectCardType(cardNumber)
      const error = validateCardNumber(cardNumber)
      setCardNumberError(error)
    } else {
      setCardType('')
      setCardNumberError('')
    }
  }, [cardNumber])

  useEffect(() => {
    if (securityCode) {
      const error = validateCVV(securityCode, cardType)
      setCvvError(error)
    } else {
      setCvvError('')
    }
  }, [securityCode, cardType])

  useEffect(() => {
    if (cardExpiryDate.length === 5) {
      const error = validateExpiryDate(cardExpiryDate)
      setExpiryError(error)
    } else {
      setExpiryError('')
    }
  }, [cardExpiryDate])

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '')
    if (/^\d*$/.test(value) && value.length <= 19) {
      setCardNumber(formatCardNumber(value))
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setCardExpiryDate(formatted)
  }

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && value.length <= 4) {
      setSecurityCode(value)
    }
  }

  const makeRequest = async () => {
    // Final validation check
    const cardError = validateCardNumber(cardNumber)
    const cvvErr = validateCVV(securityCode, cardType)
    const expiryErr = validateExpiryDate(cardExpiryDate)

    if (cardError || cvvErr || expiryErr) {
      setCardNumberError(cardError)
      setCvvError(cvvErr)
      setExpiryError(expiryErr)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setResponse(null)
      setOtpVerificationStatus('')

      const body = {
        card_number: `${cardNumber.replace(/\s/g, '')}`,
        card_holder_name: cardHolderName || "",
        security_code: `${securityCode}` || "",
        card_type: cardType || "VISA",
        amount: `${Number(amount)}` || "",
        currency: "ZMW",
        user_id: session?.id,
        base_url: `https://${next_url}/merchant/card/`,
      }

      const apiResponse = await fetch(api_endpoints.merchant.makeCardPayment, {
        method: "POST",
        headers: {
          'Content-Type': contentType,
          'Accept': accepted,
          'Authorization': `Bearer ${token}`,
          "X-Client-Id": clientId,
          "X-Transaction-Ref": transactionReference
        },
        body: JSON.stringify(body)
      })

      const data = await apiResponse.json()
      await new Promise(resolve => setTimeout(resolve, 4000))

      console.log('data', data)
      if (apiResponse.ok) {
        setResponse(data)

        const otpBody = {

          "user_id": session?.id,
          "transaction_reference": transactionReference
        }
        const sendOtp = await fetch(api_endpoints.merchant.make3DsCodeRequest, {
          method: "POST",
          headers: {
            'Content-Type': contentType,
            'Accept': accepted,
            'Authorization': `Bearer ${token}`,
            "X-Client-Id": clientId,
            "X-Transaction-Ref": transactionReference
          },
          body: JSON.stringify(otpBody)
        })

        const otpData = await sendOtp.json()
        if (sendOtp.ok) {
          setOtpResponse(otpData)
          setShowOtpDialog(true)
        } else {
          setOtpResponse(otpData)
          throw new Error(otpData.message || 'Request failed')
        }

      } else {
        setResponse(data)
        throw new Error(data.message || 'Request failed')
      }
    } catch (err) {
      setError('An error occurred while making the request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return

    try {
      setSubmitOtpLoading(true)
      setOtpVerificationStatus('loading')

      const body = {
        code: otp || "",
        user_id: session?.id || "",
        transaction_reference: transactionReference || "",
      }

      const apiResponse = await fetch(api_endpoints.merchant.make3DsVerifyCodeRequest, {
        method: "POST",
        headers: {
          'Content-Type': contentType,
          'Accept': accepted,
          'Authorization': `Bearer ${token}`,
          "X-Client-Id": clientId,
          "X-Transaction-Ref": transactionReference
        },
        body: JSON.stringify(body)
      })

      const data = await apiResponse.json()
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('data', data)
      if (apiResponse.ok) {
        setOtpResponse(data)
        setOtpVerificationStatus('success')
        // Auto-close dialog after 2 seconds on success
        setTimeout(() => {
          setShowOtpDialog(false)
          setOtp('')
        }, 2000)
      } else {
        setOtpResponse(data)
        setOtpVerificationStatus('failed')
      }
    } catch (error) {
      setOtpVerificationStatus('failed')
    } finally {
      setSubmitOtpLoading(false)
    }
  }

  const handleCopy = () => {
    if (response || otpResponse) {
      const dataToCopy = otpResponse || response
      navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isFormValid = () => {
    return (
      clientId &&
      transactionReference &&
      cardNumber &&
      !cardNumberError &&
      cardHolderName &&
      securityCode &&
      !cvvError &&
      cardExpiryDate &&
      !expiryError
    )
  }

  return (
    <main className='flex bg-gray-100 dark:bg-inherit p-6 items-center'>
      <div className="max-w-7xl mx-auto w-full">
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold dark:text-white">API Execution Sandbox</CardTitle>
            <p className="text-sm text-gray-500 dark:text-white">Test Card Simulation</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className='space-y-2'>
              <Label className="text-lg font-medium">
                Request Headers
              </Label>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
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

              <Label className="text-lg font-medium pt-10">
                Request Body
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cardNumber" className="text-sm font-medium flex items-center gap-1">
                    Card Number
                    <Badge variant="outline" className="ml-1 font-normal">Required</Badge>
                  </Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      disabled={isLoading}
                      className={`mt-1 ${cardNumberError ? 'border-red-500' : ''}`}
                    />
                    {cardType && (
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  {cardNumberError && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {cardNumberError}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cardType" className="text-sm font-medium flex items-center gap-1">
                    Card Type
                    <Badge variant="outline" className="ml-1 font-normal">
                      Detected
                    </Badge>
                  </Label>
                  <Input
                    id="cardType"
                    value={cardType ? cardType.toUpperCase() : "Not Detected"}
                    disabled
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cardHolderName" className="text-sm font-medium flex items-center gap-1">
                    Card Holder Name
                    <Badge variant="outline" className="ml-1 font-normal">Required</Badge>
                  </Label>
                  <Input
                    id="cardHolderName"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    placeholder="John Doe"
                    type="text"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cardExpiryDate" className="text-sm font-medium flex items-center gap-1">
                    Card Expiry Date
                    <Badge variant="outline" className="ml-1 font-normal">Required</Badge>
                  </Label>
                  <Input
                    id="cardExpiryDate"
                    value={cardExpiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    disabled={isLoading}
                    className={`mt-1 ${expiryError ? 'border-red-500' : ''}`}
                    maxLength={5}
                  />
                  {expiryError && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {expiryError}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="securityCode" className="text-sm font-medium flex items-center gap-1">
                    Security Code (CVV)
                    <Badge variant="outline" className="ml-1 font-normal">Required</Badge>
                  </Label>
                  <Input
                    id="securityCode"
                    value={securityCode}
                    onChange={handleCVVChange}
                    placeholder="123"
                    type="password"
                    disabled={isLoading}
                    className={`mt-1 ${cvvError ? 'border-red-500' : ''}`}
                    maxLength={4}
                  />
                  {cvvError && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {cvvError}
                    </p>
                  )}
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
                    placeholder="Enter Amount"
                    type="number"
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={makeRequest}
                disabled={isLoading || !isFormValid()}
                className="w-full mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  'Execute Request'
                )}
              </Button>
            </div>

            {/* OTP Dialog */}
            <Dialog open={showOtpDialog} onOpenChange={(open) => {
              if (!submitOtpLoading && otpVerificationStatus !== 'loading') {
                setShowOtpDialog(open)
                if (!open) {
                  setOtp('')
                  setOtpVerificationStatus('')
                }
              }
            }}>
              <DialogContent className="sm:max-w-md">
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  OTP Verification
                </DialogTitle>
                <DialogDescription className="space-y-4">
                  {response && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">
                        {response.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  <p>{transactionReference}</p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="otp" className="text-sm font-medium">
                        Enter 6-Digit OTP Code
                      </Label>
                      <Input
                        id="otp"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          if (value.length <= 6) {
                            setOtp(value)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && otp.length === 6) {
                            handleOtpSubmit()
                          }
                        }}
                        placeholder="000000"
                        className="mt-1 text-center text-2xl tracking-widest"
                        type="text"
                        maxLength={6}
                        disabled={submitOtpLoading || otpVerificationStatus === 'success'}
                        autoFocus
                      />
                    </div>

                    {otpVerificationStatus === 'success' && (
                      <Alert className="bg-green-50 border-green-200">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 ml-2">
                          OTP verified successfully! Transaction Successful
                        </AlertDescription>
                      </Alert>
                    )}

                    {otpVerificationStatus === 'failed' && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 ml-2">
                          OTP verification failed. Please check the code and try again.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleOtpSubmit}
                      className="w-full"
                      disabled={submitOtpLoading || otp.length !== 6 || otpVerificationStatus === 'success'}
                    >
                      {submitOtpLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying OTP...
                        </>
                      ) : otpVerificationStatus === 'success' ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Verified
                        </>
                      ) : (
                        'Submit OTP'
                      )}
                    </Button>
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>

            {/* Response Section */}
            {(response || otpResponse || error) && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {error ? 'Error' : 'Response'}
                  </h3>
                  {(response || otpResponse) && (
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
                {(response || otpResponse) && (
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
                    {JSON.stringify(otpResponse || response, null, 2)}
                  </SyntaxHighlighter>
                )}
                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 ml-2">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default CardContainer