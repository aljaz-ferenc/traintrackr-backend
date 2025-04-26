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
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        },
    );
}

export async function PUT(
    request: NextRequest,
    {params}: { params: Promise<{ itemId: string }> },
) {
    try {
        await connectToDatabase();
        const {itemId} = await params;
        const item = await request.json();

        const updatedItem = await FoodItemModel.findOneAndReplace(
            {_id: itemId},
            item,
        );

        return NextResponse.json(
            updatedItem,
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
    } catch (err) {
        console.error("Error updating mesocycle:", err);
        return NextResponse.json(
            {message: "Internal Server Error"},
            {status: 500},
        );
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ itemId: string }> },
) {
    try {
        await connectToDatabase();
        const {itemId} = await params;

        const deletedItem = await FoodItemModel.findByIdAndDelete(itemId)

        return NextResponse.json(
            deletedItem,
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
    } catch (err) {
        console.error("Error deleting food item:", err);
        return NextResponse.json(
            {message: "Internal Server Error"},
            {status: 500},
        );
    }
}
