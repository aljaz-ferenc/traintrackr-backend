import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/database/mongoose";
import UserModel from "@/database/models/User.model";

// Allow CORS for every request
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

export async function GET(request: NextRequest, {params}: { params: Promise<{ clerkId: string }> }) {
    try {
        const {clerkId} = await params
        console.log(clerkId)

        await connectToDatabase()
        const user = await UserModel.findOne({clerkId})

        return NextResponse.json({data: user.stats}, {
            status: 201,
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
    } catch (err) {
        return NextResponse.json({data: null}, {
            status: 201,
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
    }
}

export async function POST(request: Request, {params}: { params: Promise<{ clerkId: string }> }) {
    try {
        const userStats = await request.json()
        const {clerkId} = await params
        console.log(userStats)

        await connectToDatabase()
        const user = await UserModel.findOne({clerkId})

        if (userStats.weight) {
            user.stats.weight.push({value: userStats.weight, date: new Date()})
            await user.save()
        }

        return NextResponse.json(
            {userStats},
            {
                headers: {"Access-Control-Allow-Origin": "*"},
                status: 200,
            }
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
            }
        );
    }
}
