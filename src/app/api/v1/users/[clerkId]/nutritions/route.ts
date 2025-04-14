import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import NutritionModel from "@/database/models/Nutrition.model";
import UserModel from "@/database/models/User.model";

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
	{ params }: { params: Promise<{ clerkId: string }> },
) {
	try {
		//TODO: use same userId from mongo
		const { clerkId } = await params;
		const user = await UserModel.findOne({ clerkId });
		await connectToDatabase();
		const nutritions = await NutritionModel.find({ createdBy: user._id });

		return NextResponse.json(nutritions, {
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ message: "Error getting mesocycles" },
			{ status: 500 },
		);
	}
}
