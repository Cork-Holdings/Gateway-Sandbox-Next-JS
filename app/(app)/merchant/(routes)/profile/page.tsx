"use client"

import React, { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Mail, Phone, AlertCircle } from "lucide-react"
import { api_endpoints } from '@/utils/api_constants'
import { UserDetails } from '@/utils/types/Users'
import { useRouter } from 'next/navigation'

const MerchantProfile = () => {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchUserProfile = async () => {
    try {
      setLoading(true)

      if (!session?.id || !session?.accessToken) {
        setError("Authentication required")
        setLoading(false)
        return
      }

      const response = await fetch(`${api_endpoints.common.getUserProfile}/${session.id}`, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`
        }
      })

      const data = await response.json()

      if (response.status == 401) {
        signOut({ callbackUrl: "/auth/signin/admin" })
      }

      if (data.status === "success") {
        setUserData({
          id: data.user.id,
          fullname: data.user.fullname,
          email: data.user.email,
          role: data.user.role,
          phone: data.user.phone,
          status: data.user.status,
        })
        setError(null)
      } else {
        setError(data.message || "Failed to load profile data")
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {
      setError("An error occurred while fetching profile data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchUserProfile()
    }
  }, [session])

  const getInitials = (name?: string) => {
    if (!name) return "MR"
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Generate a deterministic color based on the user's name
  const generateAvatarColor = (name?: string) => {
    if (!name) return "#6366F1" // Default indigo color

    // Create a simple hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // List of pleasing background colors with good contrast for text
    const colors = [
      "#4F46E5", // Indigo
      "#0EA5E9", // Sky
      "#10B981", // Emerald
      "#F59E0B", // Amber
      "#8B5CF6", // Violet 
      "#EC4899", // Pink
      "#EF4444", // Red
      "#06B6D4", // Cyan
      "#14B8A6", // Teal
      "#F97316"  // Orange
    ];

    // Use the hash to select a color
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  // Generate an SVG avatar with initials
  const generateAvatarSvg = (name?: string) => {
    const initials = getInitials(name);
    const bgColor = generateAvatarColor(name);

    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${bgColor.replace('#', '%23')}" />
      <text x="50" y="50" font-family="Arial" font-size="35" font-weight="bold" text-anchor="middle" dominant-baseline="central" fill="white">${initials}</text>
    </svg>`;
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle className="mr-2" size={20} />
            <h3 className="font-medium">Error Loading Profile</h3>
          </div>
          <p className="text-gray-600">{error}</p>
          <Button onClick={fetchUserProfile} className="mt-4" variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Generate the avatar SVG source
  const avatarSrc = generateAvatarSvg(userData?.fullname);

  return (
    <main className="max-w-xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-xl font-semibold text-gray-800">Merchant Profile</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4 border-2 border-gray-200">
              <AvatarImage src={avatarSrc} alt={userData?.fullname || "Profile"} />
              <AvatarFallback className="text-lg bg-blue-100 text-blue-800">
                {getInitials(userData?.fullname)}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-2xl font-bold text-gray-800">{userData?.fullname}</h2>
            <span className={`px-3 py-1 text-xs font-medium rounded-full mt-2 border ${getStatusColor(userData?.status)}`}>
              {userData?.status || "Unknown"}
            </span>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail className="text-gray-500 mr-3" size={18} />
              <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-gray-800">{userData?.email || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Phone className="text-gray-500 mr-3" size={18} />
              <div>
                <p className="text-xs text-gray-500 font-medium">Phone</p>
                <p className="text-gray-800">{userData?.phone || "Not provided"}</p>
              </div>
            </div>


          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t gap-3 bg-gray-50 p-4">
          <Button
            onClick={() => router.push(`/merchant/reset`)}
            className="bg-gray-600 hover:bg-gray-700">

            Reset Password
          </Button>
          {/* <Button
          onClick={()=> router.push("/merchant/profile/edit")}
          className="bg-blue-600 hover:bg-blue-700">
            Update Profile
          </Button> */}
        </CardFooter>
      </Card>
    </main>
  )
}

export default MerchantProfile