import React from 'react'
import { Code } from "lucide-react";
import { Button } from '@/components/ui/button';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SIA = () => {
  return (
    <section id='documentation' className="py-20 bg-gradient-to-r from-[#00AEEF] to-[#3C3C8C]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl text-[#3C3C8C] font-bold mb-6">Designed For Developers</h2>
            <h2 className="text-xl md:text-2xl text-white font-bold mb-6">Payment Gateway APIs</h2>

            <p className="text-lg text-white mb-8">
              The Sandbox provides a secure, isolated simulation environment that allows developers and organizations to explore available APIs and observe their behavior in a controlled setting.      </p>

            <a href="/files/GEEPAY API DOCUMENTATION.pdf" download>
              <Button
                size="lg" variant="outline" className="border-white text-indigo-800 hover:bg-indigo-800 hover:text-white">
                Documentation <Code className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="flex-1 relative">
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
              {JSON.stringify({
                "code": 200,
                "status": "success",
                "message": "Name lookup completed successfully.",
                "data": {
                  "status": "success",
                  "provider": "MTN",
                  "phone_number": "260765631424",
                  "names": "John MTN Doe"
                }
              }, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </section>

  )
}

export default SIA