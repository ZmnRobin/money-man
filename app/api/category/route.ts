import connectDb from "@/utils/db";
import Category from "@/models/categorySchema";
import { NextResponse,NextRequest } from "next/server";

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