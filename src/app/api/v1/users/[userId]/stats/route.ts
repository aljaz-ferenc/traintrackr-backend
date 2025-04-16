import {type NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/database/mongoose";
import UserModel, {IUser} from "@/database/models/User.model";
import mongoose from "mongoose";
import {calcActiveMesoProgress, getCompletedWorkoutsRatio, getStatuses, getWeightsByRange} from "@/utils/utils";
import {Range} from "@/types/types";
import MesocycleModel, {IMesocycle} from "@/database/models/Mesocycle.model";

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
    {params}: { params: Promise<{ userId: string }> },
) {
    try {
        const {userId} = await params;
        const user: IUser | null = await UserModel.findById(new mongoose.Types.ObjectId(userId))

        if (!user) {
            console.log('User not found')
            return NextResponse.json(
                {message: "User not found"},
                {status: 404},
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const range: Range = searchParams.get("range") as Range || 'week'

        await connectToDatabase();

        const activeMeso = await MesocycleModel.findById(user.activeMesocycle?.mesocycle)

        return NextResponse.json(
            {
                weight: await getWeightsByRange(user, range),
                activeMesoProgress: calcActiveMesoProgress(user),
                completedWorkoutsRatio: await getCompletedWorkoutsRatio(user),
                workoutStatuses: await getStatuses(user, activeMeso)
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
            {data: null},
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
    {params}: { params: Promise<{ userId: string }> },
) {
    try {
        const userStats = await request.json();
        const {userId} = await params;
        console.log(userStats);

        await connectToDatabase();
        const user = await UserModel.findById(userId);
        console.log(user);

        if (userStats.weight) {
            user.stats.weight.push({value: userStats.weight, date: new Date()});
            await user.save();
        }

        return NextResponse.json(
            {userStats},
            {
                headers: {"Access-Control-Allow-Origin": "*"},
                status: 200,
            },
        );
    } catch (error) {
        console.error("Error creating user:", error);

        return NextResponse.json(
            {message: "Internal Server Error"},
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
    }
}
