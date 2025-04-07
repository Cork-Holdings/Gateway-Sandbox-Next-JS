"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bell, CircleX, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";


  const notifications = [
    { id: 1, message: "New merchant registration: FinTech Solutions", time: "10 minutes ago", read: false },
    { id: 2, message: "System update scheduled for tonight", time: "2 hours ago", read: false },
    { id: 3, message: "API endpoint performance issue detected", time: "3 hours ago", read: true }
  ];

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router= useRouter()

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        // <header className='fixed top-0 left-0 right-0 z-30'>
        //       <div className={`
        //         flex h-[90px] items-center justify-between px-4 lg:px-10
        //         transition-all duration-300 ease-in-out
        //         ${scrolled 
        //             ? 'bg-black/90 backdrop-blur-md shadow-lg' 
        //             : 'bg-black/90'}
        //     `}>  <div className='flex items-center'>
        //             <Image
        //             onClick={()=> router.push("/") }
        //                 src={"/images/gpay_logo_transaparent.png"}
        //                 height={150}
        //                 width={150}
        //                 alt='Geepay Logo'
        //                 className='mr-4 cursor-pointer'
        //             />
        //             <h1
        //             onClick={()=> router.push("/")}
        //             className='cursor-pointer text-sm md:text-2xl font-bold text-white'>
        //              <strong>SandBox</strong>
        //             </h1>
        //         </div>

        //         {/* Desktop Navigation */}
        //         {/* <nav className="hidden lg:flex gap-6 text-white/60 items-center">
        //             {navLinks.map((link) => (
        //                 <Link
        //                     key={link.label}
        //                     href={link.href}
        //                     className='hover:text-yellow-500 transition-colors hover:border-b-4 hover:border-b-yellow-500'
        //                 >
        //                     {link.label}
        //                 </Link>
        //             ))}
        //         </nav> */}

        //         {/* Mobile Menu Toggle */}
        //         <div className='flex items-center space-x-4'>
        //             <Button
        //                 className='lg:hidden bg-transparent text-white'
        //                 onClick={toggleMobileMenu}
        //             >
        //                 <Menu />
        //             </Button>

        //             <Button 
        //             onClick={()=>router.push("/auth/signin")}
        //             variant="secondary" 
        //             className='hidden lg:block rounded-full'>
        //                 Login
        //             </Button>
        //         </div>
        //     </div>

        //     {/* Mobile Menu Overlay */}
        //     {mobileMenuOpen && (
        //         <div className='fixed inset-0 bg-black/80 z-30 lg:hidden'>
        //             <Button

        //                 className='absolute top-4 right-4 bg-transparent text-white'
        //                 onClick={toggleMobileMenu}
        //             >
        //                 <CircleX />
        //             </Button>
        //             {/* <div className='flex flex-col items-center justify-center h-full space-y-6'>
        //                 {navLinks.map((link) => (
        //                     <Link
        //                         key={link.label}
        //                         href={link.href}
        //                         className='text-white text-2xl hover:text-gray-300'
        //                         onClick={toggleMobileMenu}
        //                     >
        //                         {link.label}
        //                     </Link>
        //                 ))}
        //                 <Button
        //                  onClick={()=>router.push("/auth/signin")}
        //                 variant="secondary"
        //                 className='mt-6 rounded-full'>
        //                     Login
        //                 </Button>
        //             </div> */}
        //         </div>
        //     )}
        // </header>
        <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">API Sandbox Admin</h1>
          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map(notification => (
                  <DropdownMenuItem key={notification.id} className={`cursor-pointer ${!notification.read ? 'font-medium' : ''}`}>
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between">
                        <span>{notification.message}</span>
                        {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-600"></span>}
                      </div>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="justify-center font-medium">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto gap-2">
                  Admin User
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

    )
}

export default Header