import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from 'lucide-react'

export function StockAnalysisCardComponent({ stockDetails, transactions }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showData, setShowData] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [futureAnalysis, setFutureAnalysis] = useState([])

  const predictions = stockDetails.map(stock => {
    const currentPrice = stock.result.price.regularMarketPrice
    const futurePrice = currentPrice ? currentPrice * 1.05 : 0 // Prediction logic (+5%)
    return {
      stockId: stock.stockId,
      currentPrice: currentPrice,
      futurePrice: futurePrice
    }
  })

  useEffect(() => {

    // console.log(1111);
    if (isOpen && isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
        setShowData(true)
      }, 5000)

      // console.log(2222)
      const fetchFutureAnalysis = async () => {
        try {
          const allPredictions = await Promise.all(
            stockDetails.map(async (stock) => {
              const response = await fetch(`https://stock-preditor-api.onrender.com/prediction/${stock.stockId}`, {
                method: 'GET', // or 'POST', depending on your API
                headers: {
                  'Content-Type': 'application/json',
                },
                mode: 'no-cors', // This tells the browser to make the request without CORS restrictions
              });
      
              // Because of `no-cors`, you won't be able to access the response directly if the API doesn't support CORS
              if (response.ok) {
                const data = await response.json();  // You may not be able to access this data in `no-cors` mode
                // console.log(data);
                return { stockId: stock.stockId, futurePrice: data.futurePrice };
              } else {
                throw new Error(`Failed to fetch data for ${stock.stockId}`);



              }
            })
          );
          // console.log(predictions);
          // console.log("bhai",allPredictions);


            setFutureAnalysis(allPredictions);

        } catch (error) {
          console.error("Error fetching future analysis:", error);
        }
      };
      

      fetchFutureAnalysis();

      if(futureAnalysis.length === 0) {
        setFutureAnalysis(predictions)
      } 

      return () => clearTimeout(timer);
    }
  }, [isOpen, isLoading, stockDetails]);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      setIsLoading(true);
      setShowData(false);
    } else {
      setIsLoading(false);
      setShowData(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Stock Analysis for Your Stocks using LSTM</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">Current Stock Analysis</p>
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>View Analysis</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Stock Analysis for All Stocks using LSTM</DialogTitle>
            </DialogHeader>
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading analysis...</span>
              </div>
            )}
            {showData && futureAnalysis.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock ID</TableHead>
                    <TableHead>Predicted 1 week later Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {futureAnalysis.map((analysis) => (
                    <TableRow key={analysis.stockId}>
                      <TableCell>{analysis.stockId}</TableCell>
                      <TableCell>${analysis.futurePrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
