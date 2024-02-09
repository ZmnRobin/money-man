import Expense from "@/models/expenseSchema";
import connectDb from "@/utils/db";
import { NextResponse,NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connectDb();
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const month = searchParams.get('month');

  try {
    let expenses;
    if (email && month) {
      // Find expenses by email and month
      expenses = await Expense.find({ email, month }).populate('category');
    } else if (email) {
      // Find expenses by email only
      expenses = await Expense.find({ email }).populate('category');
    } else {
      // Return an error if email is not provided
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDb();
  const { email, category, amount, date, month } = await request.json();

  try {
    const expenses = new Expense({ email, category, amount, date, month });
    await expenses.save();
    return NextResponse.json({ message: 'Expenses saved successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}