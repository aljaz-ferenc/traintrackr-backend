import {type NextRequest, NextResponse} from "next/server";
import UserModel from "@/database/models/User.model";
import WorkoutLogModel from "@/database/models/WorkoutLog.model";

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        },
    );
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ logId: string }> },
) {
    try {
        const {logId} = await params;
        const deletedLog = await WorkoutLogModel.findByIdAndDelete(logId)
        console.log(logId)

        return NextResponse.json(deletedLog, {
            status: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error(error);
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
