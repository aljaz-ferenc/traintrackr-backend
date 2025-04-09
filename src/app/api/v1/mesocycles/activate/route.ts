import {NextRequest, NextResponse} from "next/server";
import UserModel from "@/database/models/User.model";
import {connectToDatabase} from "@/database/mongoose";

export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {clerkId, activeMesocycle} = body;

        await connectToDatabase();

        const updatedUser = await UserModel.findOneAndUpdate(
            {clerkId},
            {activeMesocycle},
            {new: true}
        );

        if (!updatedUser) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        return NextResponse.json({data: updatedUser}, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                status: 200
            }
        );
    } catch (err) {
        console.log("Error: ", err);
        return NextResponse.json(
            {message: "Something went wrong activating meso"},
            {status: 500}
        );
    }
}
