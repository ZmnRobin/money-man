import connectDb from "@/utils/db";
import Category from "@/models/categorySchema";
import Expense from "@/models/expenseSchema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
    await connectDb();
    const searchParams=request.nextUrl.searchParams
    const email=searchParams.get('email')
    const type=searchParams.get('type')
    try {
      // Find categories by email
      const categories = await Category.find({ email,type });
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' },{status: 500 });
    }
}

export async function POST(request:NextRequest){
    await connectDb();
    const { email, name, type } = await request.json();
    try {
        // Create new category
        const category = new Category({ email, name, type });
        await category.save();
        return NextResponse.json({ message: 'Category created successfully' }, { status: 201 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Define DELETE API function
export async function DELETE(request: NextRequest) {
  await connectDb();
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const id = searchParams.get('id');
  
  try {
      // Find the category by ID and email
      const deletedCategory = await Category.findOneAndDelete({ _id: id, email });

      // If category found, remove associated expenses
      if (deletedCategory) {
          await Expense.deleteMany({ category: deletedCategory._id });
      }

      return NextResponse.json({ message: 'Category and associated expenses deleted successfully' }, { status: 200 });
  } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}