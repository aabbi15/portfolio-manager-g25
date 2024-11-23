'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { HeaderJs } from "../components/header";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { InvestmentFormJsx } from "../components/transactionForm";
import axios from "axios";
import MyChart from "../components/MyChart";



 

const DashboardJs = () => {


    useEffect(() => {
        fetch('/api/getPortfolio')
          .then((res) => res.json())
          .then((data) => {
            console.log(data)

            fetch('api/getTransaction', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ portfolioId: ['636d72cfd43b7e001e8a5b3a'] }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(error);
                });
           
          })
          .catch((error) => {
            console.log(error);
          })
      }, [])
    
    return (
        (
        

        <div>

        <HeaderJs/>
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Portfolio</h1>
                <div className="flex gap-2">
                    {/* <Button onClick={() => setIsFormOpen(true) } variant="blacky">
                        <PlusIcon  className="h-5 w-5 mr-3" />
                        Add Investments</Button> */}

                        <InvestmentFormJsx/>
                    
                </div>
            </div>

        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow">
            <div>
                <div className="text-sm text-gray-500">CURRENT VALUE</div>
                <div className="text-2xl font-bold">₹5.09 Lakh</div>
                <div className="text-sm text-gray-500">₹1.76 Lakh Invested</div>
            </div>
            <div>
                <div className="text-sm text-gray-500">1 DAY</div>
                <div className="text-xl font-bold text-green-500">₹+2,862</div>
                <div className="text-sm text-green-500">0.57%</div>
            </div>
            <div>
                <div className="text-sm text-gray-500">ALL TIME RETURNS</div>
                <div className="text-xl font-bold text-green-500">₹+3.50 Lakh</div>
                <div className="text-sm text-green-500">14.8% p.a.</div>
            </div>
        </div>
        
        <Tabs defaultValue="dashboard" className="mb-8">
            <TabsList className="overflow-auto flex-wrap flex">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="tax-report">Tax Report</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger><TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="tax-report">Tax Report</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
        </Tabs> 

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Performance</CardTitle>
            </CardHeader>
            <MyChart stockId="AAPL" startDate='2016-01-01' />
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Allocation</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center">
                    <svg width="200" height="200" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="#4f46e5" />
                        <circle cx="50" cy="50" r="30" fill="#ffffff" />
                        <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#4f46e5"
                        fontSize="10">
                        95.6%
                        </text>
                    </svg>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                    <div>Equity 95.6%</div>
                    <div>Debt 0.47%</div>
                    <div>Others 0.93%</div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="h-[200px]">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                    <rect x="10" y="20" width="10" height="60" fill="#4f46e5" />
                    <rect x="30" y="30" width="10" height="50" fill="#4f46e5" />
                    <rect x="50" y="40" width="10" height="40" fill="#4f46e5" />
                    <rect x="70" y="50" width="10" height="30" fill="#4f46e5" />
                </svg>
            </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Estimated Tax</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="h-[200px]">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                    <rect x="10" y="40" width="80" height="20" fill="#4f46e5" />
                    <rect x="10" y="70" width="40" height="20" fill="#10b981" />
                </svg>
            </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Returns by Investment Type</CardTitle>
            </CardHeader>
            <CardContent>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="1 Day" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1day">1 Day</SelectItem>
                    <SelectItem value="1week">1 Week</SelectItem>
                    <SelectItem value="1month">1 Month</SelectItem>
                </SelectContent>
            </Select>
            <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                    <span>Mutual Funds</span>
                    <span className="text-green-500">₹+4,562 (1.45%)</span>
                </div>
                <div className="flex justify-between">
                    <span>Stocks</span>
                    <span className="text-red-500">₹-1,700 (-0.92%)</span>
                </div>
            </div>
            </CardContent>
        </Card>

        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Top Gainers & Losers</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                <h3 className="mb-2 font-semibold">Top Gainers</h3>
                <div className="rounded bg-green-100 p-2">
                    <div className="font-semibold">Axis ELSS Tax Saver-G</div>
                    <div className="text-green-600">₹4,562 (1.45%)</div>
                </div>
                </div>
                <div>
                <h3 className="mb-2 font-semibold">Top Losers</h3>
                <div className="rounded bg-red-100 p-2">
                    <div className="font-semibold">Infosys</div>
                    <div className="text-red-600">₹-1,675 (-0.85%)</div>
                </div>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>VR's Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <div>
                    <div className="font-semibold">Quality Score</div>
                    <div className="h-2 w-full rounded bg-gray-200">
                        <div className="h-2 w-3/4 rounded bg-green-500"></div>
                    </div>
                </div>
                <div>
                    <div className="font-semibold">Asset Allocation</div>
                    <div>95.6% of your investments are in equities.</div>
                </div>
                <div>
                    <div className="font-semibold">Equity Sector Diversity</div>
                    <div>You have invested a high amount in just one sector. You should be more diversified.</div>
                </div>
                </div>
            </CardContent>
        </Card>

        </div>

        </div>
        </div>
            
        )
    );
  };
  
  export default DashboardJs;