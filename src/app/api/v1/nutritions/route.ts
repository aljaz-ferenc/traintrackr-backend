import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import NutritionModel from "@/database/models/Nutrition.model";

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
		const {nutrition, date} = await request.json();
		await connectToDatabase();
		nutrition.item = nutrition.item._id
		nutrition.createdAt = date
		const newNutrition = await NutritionModel.create(nutrition);

		return NextResponse.json(newNutrition, {
			status: 201,
			headers: { "Access-Control-Allow-Origin": "*" },
		});
	} catch (err) {
		console.error("Error creating nutrition:", err);
		return NextResponse.json(
			{ message: "Error creating nutrition" },
			{ status: 500 },
		);
	}
}
