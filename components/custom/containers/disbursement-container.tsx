import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DisbursementAPIContainer from './disburse-api-container'
import DisbursementStatusContainer from './disburse-status-container'


const DisbursementContainer = () => {
  return (
    <main>

<Tabs defaultValue="disbursement" className="w-full">
  <TabsList>
    <TabsTrigger value="disbursement">Disbursement API</TabsTrigger>
    <TabsTrigger value="status">Check Disbursement Status API</TabsTrigger>
  </TabsList>
  <TabsContent value="disbursement">

    <DisbursementAPIContainer/>
  </TabsContent>
  <TabsContent value="status">
    <DisbursementStatusContainer/>
  </TabsContent>
</Tabs>

    </main>
  )
}

export default DisbursementContainer

