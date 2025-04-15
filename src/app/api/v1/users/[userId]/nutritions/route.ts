import NutritionModel from "@/database/models/Nutrition.model";
import UserModel from "@/database/models/User.model";
import { connectToDatabase } from "@/database/mongoose";
import { type NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
	return NextResponse.json(
		{},
		{
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		},
	);
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		//TODO: use same userId from mongo
		const { userId } = await params;
		await connectToDatabase();
		const nutritions = await NutritionModel.find({ createdBy: userId });

		return NextResponse.json(nutritions, {
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error getting mesocycles" },
			{ status: 500 },
		);
	}
}
