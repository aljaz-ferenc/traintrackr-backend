import {type NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/database/mongoose";
import FoodItemModel from "@/database/models/FoodItem.model";

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

        const foodItems = await FoodItemModel.find({createdBy: userId});

        return NextResponse.json(foodItems, {
            status: 201,
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