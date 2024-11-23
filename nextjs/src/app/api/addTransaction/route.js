// pages/api/transactions/addTransaction.js

import connectDB from "@/helpers/connectDB";
import Transaction from "@/helpers/models/transaction";

import { NextResponse } from "next/server";
import { getSession } from '@auth0/nextjs-auth0';

import User from "@/helpers/models/user";
import Portfolio from "@/helpers/models/portfolio";

export async function POST(req, res) {
  // Ensure the database is connected
  await connectDB();

  // var Transaction = mongoose.model('Transaction');

  const body = await req.json(); 

  const user_email = body.user_email;




console.log('hi');
console.log('user_email:', user_email);

if (!user_email) {
  return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
}

let existingUser = await User.findOne({ email: user_email }).select('_id');



console.log('existingUser:', existingUser._id);




  const myportfolio= await Portfolio.findOne({userId: existingUser._id});

  // const { _id } = myportfolio.toObject();

  const portfolioId = myportfolio._id;

  console.log('portfolioId', myportfolio);
  console.log('portfolioId meri:', portfolioId);

  if (!portfolioId) {
    return NextResponse.json({ error: "Portfolio not found" });
  }

  else{

    console.log("Portfolio found in database:", portfolioId);

  }



    try {

        


        const transactions = body.transactions;

        console.log('transactions se hello:', transactions);

        var allSavedTransactions = [];

        transactions.map(async (transaction) => {
            const {
                
                stockId,
                type,
                quantity,
                purchasePrice,
                totalValue,
                transactionDate,
              } = transaction;
      
              // Validate the required fields
              if (
                !stockId ||
                !type ||
                !quantity ||
                !purchasePrice ||
                !totalValue ||
                !transactionDate
              ) {
                return NextResponse.json({ error: "Please provide all required fields" });
                  
              }

              console.log('stockId:', stockId);
      
              // Create a new transaction

              console.log(portfolioId);



              const newTransaction = new Transaction({
                portfolioId: portfolioId,
                stockId,
                type:"buy",
                quantity,
                purchasePrice,
                totalValue:quantity*purchasePrice,
                transactionDate,
              });

              console.log('newTransaction:', newTransaction);
      
              // // Save to database
              const savedTransaction = await newTransaction.save();
              console.log("Transaction saved:", savedTransaction);
              allSavedTransactions.push(savedTransaction);
        });
     

      // console.log(body);

     

      return NextResponse.json({
        message: "Transaction created successfully",
        transaction: allSavedTransactions,
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      return NextResponse.json({ error: "Internal Server Error" });
    }

    return NextResponse.json({ message: "Transaction created successfully" });
  } 

