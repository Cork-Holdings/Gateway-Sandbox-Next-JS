import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/components/custom/common/Provider";
import { Toaster } from "react-hot-toast";


 const imbplexmono = IBM_Plex_Mono({
      weight: ['400', '600'], 
      subsets: ['latin'],     
      display: 'swap',          
    });


export const metadata: Metadata = {
  title: "Payment Gateway Sandbox",
  description: "GeePay Payment Gateway Sandbox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${imbplexmono.className} antialiased`}
      >
      <Provider> 
            
            {children}
          
          <Toaster/>
          </Provider>
      </body>
    </html>
  );
}
