import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import UserModel from "@/database/models/User.model";

// Allow CORS for every request
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

export async function POST(request: Request) {
	const user = await request.json();

	user.stats = {
		weight: [],
	};

	try {
		await connectToDatabase();
		const createdUser = await UserModel.create(user);

		return NextResponse.json(
			{ data: createdUser },
			{
				status: 201,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			},
		);
	} catch (error) {
		console.error("Error creating user:", error);

		return NextResponse.json(
			{ message: "Internal Server Error" },
			{
				status: 500,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			},
		);
	}
}
