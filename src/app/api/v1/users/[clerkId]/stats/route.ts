import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import UserModel from "@/database/models/User.model";
import { endOfToday, subMonths, subWeeks, subYears } from "date-fns";

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

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ clerkId: string }> },
) {
	try {
		const { clerkId } = await params;
		const searchParams = request.nextUrl.searchParams;
		const range = searchParams.get("range");

		const toDate = endOfToday();
		let fromDate: Date;

		switch (range) {
			case "week":
				fromDate = subWeeks(toDate, 1);
				break;
			case "month":
				fromDate = subMonths(toDate, 1);
				break;
			case "year":
				fromDate = subYears(toDate, 1);
				break;
			default:
				fromDate = subWeeks(toDate, 1);
		}

		console.log("RANGE: ", range);
		console.log("FROM_DATE: ", fromDate);
		console.log("TO_DATE: ", toDate);

		await connectToDatabase(); // MOVE THIS FIRST ⚡

		const filteredWeights = await UserModel.aggregate([
			{ $match: { clerkId } },
			{ $unwind: "$stats.weight" },
			{
				$match: {
					"stats.weight.date": { $gte: fromDate },
				},
			},
			{
				$project: {
					_id: 0,
					value: "$stats.weight.value", // <-- Correct this
					date: "$stats.weight.date", // <-- Include date if needed
				},
			},
		]);

		console.log("FILTERED_WEIGHTS: ", filteredWeights);

		if (!filteredWeights.length) {
			return NextResponse.json(
				{ message: "No weights found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ weight: filteredWeights },
			{
				status: 201,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			},
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ data: null },
			{
				status: 500, // Make it 500 for error
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			},
		);
	}
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ clerkId: string }> },
) {
	try {
		const userStats = await request.json();
		const { clerkId } = await params;
		console.log(userStats);

		await connectToDatabase();
		const user = await UserModel.findOne({ clerkId });
		console.log(user);

		if (userStats.weight) {
			user.stats.weight.push({ value: userStats.weight, date: new Date() });
			await user.save();
		}

		return NextResponse.json(
			{ userStats },
			{
				headers: { "Access-Control-Allow-Origin": "*" },
				status: 200,
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
