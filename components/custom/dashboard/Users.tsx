import React from 'react'
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  
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
  

  const userStats = {
    total: 1250,
    newToday: 12,
    newThisWeek: 78,
    newThisMonth: 245,
    active: 890,
    inactive: 360,
    byRole: [
      { role: "Admin", count: 5 },
      { role: "Developer", count: 850 },
      { role: "Merchant", count: 395 }
    ]
  };


const UsersTab = () => {
  return (
    <main>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>User Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Users</span>
                        <span className="font-medium">{userStats.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Users</span>
                        <span className="font-medium">{userStats.active} ({Math.round(userStats.active/userStats.total*100)}%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Inactive Users</span>
                        <span className="font-medium">{userStats.inactive} ({Math.round(userStats.inactive/userStats.total*100)}%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Today</span>
                        <span className="font-medium">{userStats.newToday}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New This Week</span>
                        <span className="font-medium">{userStats.newThisWeek}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New This Month</span>
                        <span className="font-medium">{userStats.newThisMonth}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Users by Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userStats.byRole.map((role, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{role.role}</span>
                            <span>{role.count} ({Math.round(role.count / userStats.total * 100)}%)</span>
                          </div>
                          <Progress value={Math.round(role.count / userStats.total * 100)} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button className="w-full">Add New User</Button>
                      <Button variant="outline" className="w-full">Manage Roles</Button>
                      <Button variant="outline" className="w-full">Bulk Actions</Button>
                      <Button variant="outline" className="w-full">Export User Data</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>User List</CardTitle>
                  <CardDescription>Manage system users and their details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>John Doe</TableCell>
                          <TableCell>john@example.com</TableCell>
                          <TableCell>Developer</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-100 text-green-700">Active</span>
                          </TableCell>
                          <TableCell>2 months ago</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jane Smith</TableCell>
                          <TableCell>jane@example.com</TableCell>
                          <TableCell>Merchant</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-100 text-green-700">Active</span>
                          </TableCell>
                          <TableCell>1 month ago</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Bob Johnson</TableCell>
                          <TableCell>bob@example.com</TableCell>
                          <TableCell>Admin</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-100 text-green-700">Active</span>
                          </TableCell>
                          <TableCell>6 months ago</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Alice Brown</TableCell>
                          <TableCell>alice@example.com</TableCell>
                          <TableCell>Developer</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-red-100 text-red-700">Inactive</span>
                          </TableCell>
                          <TableCell>3 months ago</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
    </main>
  )
}

export default UsersTab