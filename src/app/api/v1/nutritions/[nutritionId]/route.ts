import MesocycleModel from "@/database/models/Mesocycle.model";
import NutritionModel from "@/database/models/Nutrition.model";
import { connectToDatabase } from "@/database/mongoose";
import { type NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
	return NextResponse.json(
		{},
		{
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "OPTIONS, DELETE, PATCH",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		},
	);
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ nutritionId: string }> },
) {
	try {
		await connectToDatabase();
		const { nutritionId } = await params;
		console.log(nutritionId);
		const deletedNutrition =
			await NutritionModel.findByIdAndDelete(nutritionId);

		return NextResponse.json(deletedNutrition, {
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			status: 200,
		});
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "No nutritionId" }, { status: 404 });
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ nutritionId: string }> },
) {
	try {
		await connectToDatabase();
		const payload = await request.json();
		const { nutritionId } = await params;
		console.log("NUTRITION: ", nutritionId);
		console.log("PAYLOAD: ", payload);
		const updatedNutrition = await NutritionModel.findByIdAndUpdate(
			nutritionId,
			{ amount: payload },
			{ new: true },
		);

		console.log("UPDATED NUTRITION: ", updatedNutrition);

		return NextResponse.json(updatedNutrition, {
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			status: 200,
		});
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "No nutritionId" }, { status: 404 });
	}
}
