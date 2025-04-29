import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import MesocycleModel from "@/database/models/Mesocycle.model";
import WorkoutLogModel from "@/database/models/WorkoutLog.model";
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

export async function PUT(request: Request) {
	try {
		await connectToDatabase();

		const body = await request.json();
		const { weekNumber, workout, mesoId, userId } = body;

		const workoutLog = await WorkoutLogModel.findOne({ mesoId });

		if (!workoutLog) {
			throw new Error("WorkoutLog not found");
		}

		workout.completedAt = new Date();
		workoutLog.weeks[weekNumber - 1].workouts.push(workout);

		const updatedLog = await workoutLog.save();

		await UserModel.findByIdAndUpdate(userId, { lastWorkout: new Date() });

		return NextResponse.json(
			{ data: updatedLog },
			{
				status: 201,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			},
		);
	} catch (error) {
		console.error("Error updating workout log:", error);

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
