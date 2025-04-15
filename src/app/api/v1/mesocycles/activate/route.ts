import MesocycleModel from "@/database/models/Mesocycle.model";
import {type NextRequest, NextResponse} from "next/server";
import UserModel from "@/database/models/User.model";
import {connectToDatabase} from "@/database/mongoose";
import WorkoutLogModel from "@/database/models/WorkoutLog.model";

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        },
    );
}

export async function POST(request: NextRequest) {
    try {
        await MesocycleModel;
        const body = await request.json();
        const {userId, activeMesocycle} = body;

        await connectToDatabase();

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {activeMesocycle},
            {new: true},
        );

        const user = await updatedUser.populate("activeMesocycle.mesocycle");

        if (!user || !user.activeMesocycle || !user.activeMesocycle.mesocycle) {
            return NextResponse.json(
                {message: "User or active mesocycle not found"},
                {status: 400},
            );
        }
        //
        // // Extract populated activeMesocycle
        const activeMeso = updatedUser.activeMesocycle.mesocycle;
        //
        const createEmptyWeeks = (length: number) => new Array(length).fill({});
        const initialWorkoutLog = {
            mesoTitle: activeMeso.title,
            mesoId: activeMeso._id,
            mesoDuration: Number(activeMeso.duration),
            includeDeload: activeMeso.includeDeload,
            splitType: activeMeso.splitType,
            createdBy: activeMeso.createdBy,
            weeks: createEmptyWeeks(activeMeso.duration),
        };

        const log = await WorkoutLogModel.create(initialWorkoutLog);

        if (!updatedUser) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        return NextResponse.json(
            updatedUser,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                status: 200,
            },
        );
    } catch (err) {
        console.log("Error: ", err);
        return NextResponse.json(
            {message: "Something went wrong activating meso"},
            {status: 500},
        );
    }
}
