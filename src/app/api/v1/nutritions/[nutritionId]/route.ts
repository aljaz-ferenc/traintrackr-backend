import { type NextRequest, NextResponse } from "next/server";
import MesocycleModel from "@/database/models/Mesocycle.model";
import { connectToDatabase } from "@/database/mongoose";
import NutritionModel from "@/database/models/Nutrition.model";

export async function OPTIONS() {
	return NextResponse.json(
		{},
		{
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
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
		return NextResponse.json({ error: "No mesoId" }, { status: 404 });
	}
}
