import {connectToDatabase} from "@/database/mongoose";
import {NextRequest, NextResponse} from "next/server";
import UserModel from "@/database/models/User.model";

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

export async function GET(request: NextRequest, { params }: { params: { clerkId: string } }) {
    try {
        const { clerkId } = await params;
        await connectToDatabase();

        const user = await UserModel.findOne({ clerkId }).populate('activeMesocycle.mesocycle')

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(
            { user },
            {
                headers: { "Access-Control-Allow-Origin": "*" },
                status: 200,
            }
        );
    } catch (err) {
        console.log('Error fetching user:', err);
        return NextResponse.json({ message: 'Something went wrong getting user' }, { status: 500 });
    }
}
