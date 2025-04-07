import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Code, Globe, LucideCheckCircle, Server, Shield, Zap } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Test & Build</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our sandbox provides all the tools and features you need to simulate real-world payment scenarios.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-10 w-10 text-blue-600" />,
                title: "Global Payment Methods",
                description: "Test credit cards, digital wallets, bank transfers and local payment methods from around the world."
              },
              {
                icon: <Shield className="h-10 w-10 text-blue-600" />,
                title: "Security Testing",
                description: "Simulate 3D Secure flows, fraud scenarios, and compliance requirements in a safe environment."
              },
              {
                icon: <Zap className="h-10 w-10 text-blue-600" />,
                title: "Real-time Response",
                description: "Experience the same response times and behavior as our production environment."
              },
              {
                icon: <Server className="h-10 w-10 text-blue-600" />,
                title: "Webhook Testing",
                description: "Configure and test webhook notifications for all events in your integration flow."
              },
              {
                icon: <Code className="h-10 w-10 text-blue-600" />,
                title: "API Explorer",
                description: "Interactive documentation that lets you make API calls directly from your browser."
              },
              {
                icon: <LucideCheckCircle className="h-10 w-10 text-blue-600" />,
                title: "Scenario Builder",
                description: "Create custom test scenarios including declines, refunds, disputes and more."
              },
            ].map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

  )
}

export default Features