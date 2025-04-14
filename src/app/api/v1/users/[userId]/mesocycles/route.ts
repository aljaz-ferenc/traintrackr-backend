import {type NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/database/mongoose";
import FoodItemModel from "@/database/models/FoodItem.model";
import MesocycleModel from "@/database/models/Mesocycle.model";

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    try {
        await connectToDatabase();
        const { userId } = await params;

        const mesocycles = await MesocycleModel.find({createdBy: userId});

        return NextResponse.json(mesocycles, {
            status: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
        });
    } catch (err) {
        console.error("Error finding food items:", err);
        return NextResponse.json(
            { message: "Error finding food items" },
            { status: 500 },
        );
    }
}