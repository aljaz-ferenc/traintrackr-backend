import { type NextRequest, NextResponse } from "next/server";
import MesocycleModel from "@/database/models/Mesocycle.model";
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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> },
) {
    try {
        const { userId } = await params;
        const logs = await WorkoutLogModel.find({ createdBy: userId });

        return NextResponse.json(logs, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                status: 200,
            },
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "No mesoId" }, { status: 404 });
    }
}
