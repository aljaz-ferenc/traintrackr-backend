import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import UserModel, { type IUser } from "@/database/models/User.model";
import mongoose from "mongoose";
import {
	calcMacros,
	getCompletedWorkoutsRatio,
	getNutritionsByRange,
	getStatuses, getWeightChangeInRange,
	getWeightsInRange,
} from "@/utils/utils";
import type { Range } from "@/types/types";
import MesocycleModel, { IMesocycle } from "@/database/models/Mesocycle.model";
import NutritionModel from "@/database/models/Nutrition.model";
import {endOfToday, endOfWeek, getDay, isAfter, isBefore, isSameDay, startOfWeek} from "date-fns";

export async function OPTIONS() {
	return NextResponse.json(
		{},
		{
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PATCH",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		},
	);
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		const { userId } = await params;
		const payload = await request.json();
		// console.log(payload);
		await connectToDatabase();
		const updatedUser: IUser | null = await UserModel.findByIdAndUpdate(
			userId,
			{ stats: payload },
			{ new: true },
		);

		if (!updatedUser) {
			console.log("User not found");
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json(updatedUser, {
			status: 201,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ data: null },
			{
				status: 500,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			},
		);
	}
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		const { userId } = await params;
		console.log(userId);

		await connectToDatabase();

		const user: IUser | null = await UserModel.findById(userId).lean();

		if (!user) {
			console.log("User not found");
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		const searchParams = request.nextUrl.searchParams;
		const range: Range = (searchParams.get("range") as Range) || "week";

		await connectToDatabase();

		const activeMeso = await MesocycleModel.findById(
			user.activeMesocycle?.mesocycle,
		);

		const macrosToday = calcMacros(
			await getNutritionsByRange(new mongoose.Types.ObjectId(userId), "today"),
		);

		const {total, completed} = await getCompletedWorkoutsRatio(user)

		const nutritions = await NutritionModel.find({
			createdBy: userId,
			date: {
				$gte: startOfWeek(new Date()),
				$lte: endOfToday()
			}
		})

		const nutritionsThisWeek = await NutritionModel.find({
			createdBy: new mongoose.Types.ObjectId(userId),
			date: {
				$gte: startOfWeek(new Date()),
				$lte: endOfWeek(new Date())
			}
		}).populate('item').lean()

		return NextResponse.json(
			{
				// weight: await getWeightsByRange(user, range),
				// activeMesoProgress: calcActiveMesoProgress(user),
				// completedWorkoutsRatio: await getCompletedWorkoutsRatio(user),
				// workoutStatuses: await getStatuses(user, activeMeso)
				nutrition: {
					caloriesToday: macrosToday.calories,
					macrosToday,
					caloriesGoal: user.tdee,
					caloriesLeftToday: user.tdee - macrosToday.calories,
					averageDailyCaloriesThisWeek: Math.round(calcMacros(nutritionsThisWeek).calories / (getDay(new Date()) + 1)),
                    tdee: user.tdee || null
				},
				weight: {
					current: user.stats.weight[user.stats.weight.length - 1],
					starting: user.stats.weight[0],
					changeInRange: await getWeightChangeInRange(user, range),
					averageWeeklyChangeInRange: 1,//TODO
					startingThisMeso: !activeMeso ? null : 1, //TODO
					changeThisMeso: !activeMeso ? null : 1, //TODO
					averageWeeklyChangeThisMeso: !activeMeso ? null : 1, //TODO
					weightsInRange: await getWeightsInRange(user, range)
				},
				workouts: {
					completed,
					total,
					mesoProgress: !activeMeso ? null : Math.round(completed / total * 100),
					statuses: await getStatuses(user, activeMeso)
				},
			},
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
				status: 500,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			},
		);
	}
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		const userStats = await request.json();
		const { userId } = await params;
		console.log(userStats);

		await connectToDatabase();
		const user = await UserModel.findById(userId);
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
