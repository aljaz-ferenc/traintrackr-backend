import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/database/models/User.model";
import { connectToDatabase } from "@/database/mongoose";
import WorkoutLogModel from "@/database/models/WorkoutLog.model";

export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();
        await connectToDatabase();

        // Fetch user and populate activeMesocycle
        const user = await UserModel.findOne({ clerkId: userId }).populate('activeMesocycle.mesocycle');
        if (!user || !user.activeMesocycle || !user.activeMesocycle.mesocycle) {
            return NextResponse.json({ message: "User or active mesocycle not found" }, { status: 400 });
        }

        // Extract populated activeMesocycle
        const activeMeso = user.activeMesocycle.mesocycle;
        console.log(activeMeso); // Ensure it's populated

        // Check that duration is a valid number
        if (isNaN(activeMeso.duration) || activeMeso.duration <= 0) {
            return NextResponse.json({ message: "Invalid mesocycle duration" }, { status: 400 });
        }

        // Create empty weeks based on mesocycle duration
        const createEmptyWeeks = (length: number) => new Array(length).fill({});
        const initialWorkoutLog = {
            mesoTitle: activeMeso.title,
            mesoDuration: activeMeso.duration,
            mesoId: activeMeso._id,
            includeDeload: activeMeso.includeDeload,
            splitType: activeMeso.splitType,
            createdBy: activeMeso.createdBy,
            weeks: createEmptyWeeks(activeMeso.duration),
        };

        // Create the workout log
        const log = await WorkoutLogModel.create(initialWorkoutLog);
        console.log("Workout Log Created:", log);

        return NextResponse.json({ userId, log }, {
            status: 201,
            headers: { "Access-Control-Allow-Origin": "*" }
        });
    } catch (err) {
        console.error("Error creating workout log:", err);
        return NextResponse.json({ message: 'Error creating log' }, { status: 500 });
    }
}
