'use client'

import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { StarIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { usePathname } from 'next/navigation';
import MyChart from '@/app/components/MyChart';

function calculateLiquidity(summaryDetail) {
    const regularMarketVolume = summaryDetail.regularMarketVolume;
    const averageDailyVolume10Day = summaryDetail.averageDailyVolume10Day;
    const marketCap = summaryDetail.marketCap;
    const regularMarketPrice = summaryDetail.regularMarketPreviousClose;
  
    // Liquidity Ratio
    const liquidityRatio = regularMarketVolume / averageDailyVolume10Day;
  
    // Volume Turnover Ratio
    const volumeTurnoverRatio = (regularMarketVolume * regularMarketPrice) / marketCap;
  
    return liquidityRatio.toFixed(0);
  }
  

  


const StockInfo = () => {
  const pathname = usePathname();
  const stockId = pathname.split("/")[2]; // Extract stockId from the URL
  const [stockDetails, setStockDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await fetch('/api/all-stock-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stockIds: [stockId] }),
        });
        const data = await response.json();
        setStockDetails(data.stockDetails[0]); // Get the first stock detail
        console.log('Fetched stock details:', data.stockDetails[0].result);
      } catch (error) {
        console.error('Error fetching stock details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [stockId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stockDetails) {
    return <div>Error fetching stock details</div>;
  }

  // Extract data from the stockDetails response
  const {
    result: { price, summaryDetail, summaryProfile },
  } = stockDetails;

  const liquidityRatio = calculateLiquidity(summaryDetail);

  console.log('Liquidity Ratio:', liquidityRatio);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">{price.longName || price.shortName}</h1>
          <div className="flex items-center">
            <span className="text-3xl font-bold mr-2">${price.regularMarketPrice.toFixed(2)}</span>
            <span
              className={`${
                price.regularMarketChange > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {price.regularMarketChange > 0 ? '+' : ''}
              ${price.regularMarketChange.toFixed(2)} (
              {price.regularMarketChangePercent.toFixed(2)}%)
            </span>
          </div>
          <p className="text-sm text-gray-500">
            As on {new Date(price.regularMarketTime).toLocaleString()}
          </p>
        </div>
        <div>
          <Button variant="blacky">Share</Button>
        </div>
      </div>

      {/* Value Research Rating */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Value Research Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-semibold">Quality Score</p>
                <p className="text-lg font-bold text-green-500">8/10</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Growth Score</p>
                <p className="text-lg font-bold text-yellow-500">6/10</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Valuation Score</p>
                <p className="text-lg font-bold text-yellow-500">6/10</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Momentum Score</p>
                <p className="text-lg font-bold text-red-500">2/10</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Price Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{price.longName || price.shortName} Share Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div>
              <span className="font-semibold">High:</span> ${summaryDetail.dayHigh.toFixed(2)}
              <span className="font-semibold ml-4">Low:</span> ${summaryDetail.dayLow.toFixed(2)}
             
            </div>
           
          </div>
          <MyChart stockId={stockId} startDate="2019-01-01" />
        </CardContent>
      </Card>

      {/* Stock Range Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Stock Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-semibold mb-2">Today's Range</p>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{
                      width: `${
                        ((price.regularMarketPrice - summaryDetail.dayLow) /
                          (summaryDetail.dayHigh - summaryDetail.dayLow)) *
                        100
                      }%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>${summaryDetail.dayLow.toFixed(2)}</span>
                  <span>${summaryDetail.dayHigh.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">52 Week Range</p>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{
                      width: `${
                        ((price.regularMarketPrice - summaryDetail.fiftyTwoWeekLow) /
                          (summaryDetail.fiftyTwoWeekHigh - summaryDetail.fiftyTwoWeekLow)) *
                        100
                      }%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>${summaryDetail.fiftyTwoWeekLow.toFixed(2)}</span>
                  <span>${summaryDetail.fiftyTwoWeekHigh.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">Liquidity</p>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${liquidityRatio*100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fundamentals */}
      <Card>
        <CardHeader>
          <CardTitle>Fundamentals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Market Cap</p>
              <p className="font-semibold">${summaryDetail.marketCap.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">P/E Ratio</p>
              <p className="font-semibold">{summaryDetail.trailingPE || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">P/B Ratio</p>
              <p className="font-semibold">{summaryDetail.priceToBook || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Industry P/E</p>
              <p className="font-semibold">{summaryDetail.forwardPE || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ROE</p>
              <p className="font-semibold">42.38%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ROCE</p>
              <p className="font-semibold">-</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Div. Yield</p>
              <p className="font-semibold">{summaryDetail.dividendYield || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Book Value</p>
              <p className="font-semibold">{summaryDetail.bookValue || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Profile */}
      <Card className="mb-6 mt-6">
  <CardHeader>
    <CardTitle>Company Details</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Address</p>
        <p className="font-semibold">
          {`${summaryProfile.address1}, ${summaryProfile.city}, ${summaryProfile.state}, ${summaryProfile.zip}, ${summaryProfile.country}`}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Phone</p>
        <p className="font-semibold">{summaryProfile.phone}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Website</p>
        <a
          href={summaryProfile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-500 hover:underline"
        >
          {summaryProfile.website}
        </a>
      </div>
      <div>
        <p className="text-sm text-gray-500">Industry</p>
        <p className="font-semibold">{summaryProfile.industry}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Sector</p>
        <p className="font-semibold">{summaryProfile.sector}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Employees</p>
        <p className="font-semibold">{summaryProfile.fullTimeEmployees.toLocaleString()}</p>
      </div>
      <div className="col-span-2">
        <p className="text-sm text-gray-500">Business Summary</p>
        <p className="text-justify">{summaryProfile.longBusinessSummary}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Investor Relations</p>
        <a
          href={summaryProfile.irWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-500 hover:underline"
        >
          Investor Relations Page
        </a>
      </div>
    </div>
  </CardContent>
</Card>

    </div>
  );
};

export default StockInfo;