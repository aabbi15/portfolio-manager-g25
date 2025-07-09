import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(req, res) {
    try {
        // Fetch the daily gainers data
        const queryOptions = { count: 4, region: 'US', lang: 'en-US' };

        let result = {};


        try{
            result = await yahooFinance.dailyGainers(queryOptions);
        }
        catch(err){
            result = err.result;
        }

        // console.log(result);

        // Extract relevant data for each stock
        const gainers = result.quotes.map(stock => ({
            name: stock.displayName,
            stockId: stock.symbol,
            gain: stock.regularMarketChangePercent
        }));

        // console.log('Extracted gainers:', gainers);

        console.log('Daily gainers fetched successfully');
        // Return the array of objects
        return NextResponse.json(gainers);
    } catch (err) {


        console.log('Error fetching daily gainers:', err);
        return NextResponse.json({ error: 'Failed to fetch daily gainers' }, { status: 500 });
    }
}
