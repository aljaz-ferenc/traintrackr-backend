import { type NextRequest, NextResponse } from "next/server";
import UserModel from "@/database/models/User.model";
import { connectToDatabase } from "@/database/mongoose";
import FoodItemModel from "@/database/models/FoodItem.model";

export async function OPTIONS() {
	return NextResponse.json(
		{},
		{
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		},
	);
}

export async function POST(request: NextRequest) {
	try {
		const foodItem = await request.json();
		await connectToDatabase();
		console.log(foodItem);
		const newFoodItem = await FoodItemModel.create(foodItem);

		return NextResponse.json(
			{ data: null },
			{
				status: 201,
				headers: { "Access-Control-Allow-Origin": "*" },
			},
		);
	} catch (err) {
		console.error("Error creating food item:", err);
		return NextResponse.json(
			{ message: "Error creating food item" },
			{ status: 500 },
		);
	}
}


