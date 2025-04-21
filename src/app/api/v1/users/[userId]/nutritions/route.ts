import '@/database/models/FoodItem.model'
import NutritionModel, {INutrition} from "@/database/models/Nutrition.model";
import {connectToDatabase} from "@/database/mongoose";
import {type NextRequest, NextResponse} from "next/server";
import {addDays, addHours, endOfToday, endOfWeek, startOfDay, startOfToday, startOfWeek} from "date-fns";

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
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
        await connectToDatabase();
        const nutritionsToday = await NutritionModel.find({
            createdBy: userId,
            date: {$gte: startOfToday(), $lte: endOfToday()}
        }).populate('item');

        const totalMacros = nutritionsToday.reduce(
            (acc, nutrition) => {

                return {
                    calories: Math.round(acc.calories + nutrition.item.calories * nutrition.amount / 100),
                    protein: Math.round(acc.protein + nutrition.item.protein * nutrition.amount / 100),
                    fat: Math.round(acc.fat + nutrition.item.fat * nutrition.amount / 100),
                    carbs: Math.round(acc.carbs + nutrition.item.carbs * nutrition.amount / 100),
                };
            },
            {
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0,
            }
        );


        const now = addHours(new Date(), 2)

        const nutritionsThisWeek = await NutritionModel.find({
            createdBy: userId,
            date: {
                $gte: addHours(startOfDay(addDays(startOfWeek(now), 1)), 2),
                $lte: addHours(addDays(endOfWeek(now), 1), 2)
            }
        }).populate('item')

        return NextResponse.json(
            {nutritionsToday, totalMacros, nutritionsThisWeek},
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {message: "Error getting mesocycles"},
            {status: 500},
        );
    }
}
