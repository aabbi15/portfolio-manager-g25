// pages/api/transactions/addTransaction.js

import connectDB from "@/helpers/connectDB";
import { NextResponse } from "next/server";
import { getSession } from '@auth0/nextjs-auth0';
import User from "@/helpers/models/user";
import Portfolio from "@/helpers/models/portfolio";


import Transaction from "@/helpers/models/transaction";

export async function POST(req, res) {

  // console.log("Adding transaction...");
  const session = await getSession();
  const { user } =  session;

  
  console.log("User session:", user);
  await connectDB();

  try {
   

    if (!user || !user.email) {
      console.log("User not authenticated");
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
      // console.error("User not authenticated");
    }

    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
    
      existingUser = new User({
        email: user.email,
        name: user.nickname || "",
        createdAt: new Date(),
      });

      

      await existingUser.save();


   
    } else {
      console.log("User found in database:", existingUser);
    }

      const portfolios = await Portfolio.find({ userId: existingUser._id }).select('_id name');

      let portfolioIds = [];

      if(portfolios.length === 0){

        let initPortfolio = new Portfolio({
          userId: existingUser._id,
          name: "My Portfolio",
          createdAt: new Date(),
        });
        await initPortfolio.save();
        // console.log("Portfolio initialized:", initPortfolio);
        portfolioIds.push(initPortfolio._id);

      }
      else{
      portfolioIds = portfolios.map(portfolio => portfolio._id);
      }

      // console.log("Portfolios found:", portfolios);

      const myportfolio = portfolios[0];

      const transactions = await Transaction.find({portfolioId: myportfolio._id});

      // console.log(transactions);


      return NextResponse.json({
        message: "User and portfolios retrieved successfully",
        user: existingUser,
        portfolios: portfolioIds,
        transactions: transactions
      });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 501 });
  }
}
