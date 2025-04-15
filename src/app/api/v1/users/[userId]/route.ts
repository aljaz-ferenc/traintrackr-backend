import UserModel from "@/database/models/User.model";
import { connectToDatabase } from "@/database/mongoose";
import { type NextRequest, NextResponse } from "next/server";
import "@/database/models/Mesocycle.model";

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

export async function GET(
	request: NextRequest,
	context: { params: Promise<{ userId: string }> },
) {
	try {
		const { userId } = await context.params;
		const searchParams = request.nextUrl.searchParams;
		await connectToDatabase();

		if (searchParams.has("workoutDates")) {
			console.log("WORKOUT_DATES");
		}

		if (searchParams.has("nutrition")) {
			console.log("NUTRITION");
		}

		const user = await UserModel.findOne({ clerkId: userId }).populate(
			"activeMesocycle.mesocycle",
		);

		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json(user, {
			headers: { "Access-Control-Allow-Origin": "*" },
			status: 200,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
