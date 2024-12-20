'use client';

import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

// Import necessary Chart.js components
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AllocationCard = ({ stockDetails ,transactions}) => {
    const [chartData, setChartData] = useState(null);

    // console.log("yoyo",stockDetails,transactions);

    useEffect(() => {
        // Extract and calculate industry allocation
        const calculateIndustryAllocations = () => {
            const industryAllocations = {};

            stockDetails.forEach(({ stockId, result }) => {

                
                const industry = result.summaryProfile.industry;
                const marketCap = result.price.marketCap || 0;

                if (industryAllocations[industry]) {
                    industryAllocations[industry] += marketCap;
                } else {
                    industryAllocations[industry] = marketCap;
                }
            });

            // Normalize to percentages
            const totalMarketCap = Object.values(industryAllocations).reduce((a, b) => a + b, 0);
            const normalizedAllocations = Object.entries(industryAllocations).map(([industry, value]) => ({
                industry,
                percentage: ((value / totalMarketCap) * 100).toFixed(2),
            }));

            // console.log(normalizedAllocations);

            return normalizedAllocations;

            
        };

        const allocations = calculateIndustryAllocations();

        // Prepare data for Chart.js
        setChartData({
            labels: allocations.map(a => a.industry),
            datasets: [
                {
                    data: allocations.map(a => parseFloat(a.percentage)),
                    backgroundColor: [
                        '#4f46e5', // Tech
                        '#10b981', // Petroleum
                        '#f59e0b', // Finance
                        '#ef4444', // Healthcare
                        '#8b5cf6', // Defense
                        '#22d3ee', // Retail
                    ],
                    borderWidth: 1,
                },
            ],
        });
    }, [stockDetails]);

    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Allocation</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center">
                    {/* Render Doughnut Chart */}
                    <Doughnut
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true, // Display legend
                                    position: 'bottom',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (tooltipItem) {
                                            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
                <div className="mt-4 flex flex-col gap-2 text-sm">
                    {chartData.labels.map((industry, index) => (
                        <div key={index} className="flex justify-between">
                            <span>{industry}</span>
                            <span>{chartData.datasets[0].data[index].toFixed(2)}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default AllocationCard;
