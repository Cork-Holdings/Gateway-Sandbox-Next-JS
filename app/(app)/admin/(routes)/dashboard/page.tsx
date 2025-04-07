// pages/dashboard.jsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Bell, 
  CheckCircle, 
  Database, 
  FileKey, 
  Lock, 
  Users, 
  Settings, 
  Store,
  PieChart,
  Server,
  BarChartHorizontal,
  Globe
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Overview from '@/components/custom/dashboard/Overview';
import UsersTab from '@/components/custom/dashboard/Users';
import MerchantsTab from '@/components/custom/dashboard/MerchantsTab';
import ApisTab from '@/components/custom/dashboard/ApisTab';
import TransactionsTab from '@/components/custom/dashboard/TransactionsTab';


export default function Dashboard() {
  



  

  return (

      <div className="flex flex-1">


        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
            </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="merchants">Merchants</TabsTrigger>
              <TabsTrigger value="api">API Usage</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Overview/>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <UsersTab/>
            </TabsContent>

            <TabsContent value="merchants" className="space-y-4">
              <MerchantsTab/>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <ApisTab/>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
             <TransactionsTab/>
            </TabsContent>
          </Tabs>
        </main>
      </div>

  );
}