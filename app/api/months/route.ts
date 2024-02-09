import Expense from "@/models/expenseSchema";
import connectDb from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await connectDb();
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
  
    try {
      if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
      }
  
      // Find distinct months for the given user
      const distinctMonths = await Expense.distinct('month', { email });
  
      return NextResponse.json(distinctMonths, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }
  