import '@/database/models/FoodItem.model'
import NutritionModel, {INutrition} from "@/database/models/Nutrition.model";
import {connectToDatabase} from "@/database/mongoose";
import {type NextRequest, NextResponse} from "next/server";
import {
    addDays,
    addHours,
    endOfDay,
    endOfToday,
    endOfWeek,
    startOfDay,
    startOfToday,
    startOfWeek,
    subDays
} from "date-fns";

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
        const searchParams = request.nextUrl.searchParams
        await connectToDatabase();

        const dateString = searchParams.get('date') as unknown
        let date: Date

        if(typeof dateString === 'string'){
            date = new Date(dateString)
        }else{
            date = new Date()
        }

        const nutritions = await NutritionModel.find({
            createdBy: userId,
            createdAt: {$gte: startOfDay(new Date(date)), $lte: endOfDay(new Date(date))}
        }).populate('item');

        const totalMacros = nutritions.reduce(
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

        return NextResponse.json(
            {nutritions, totalMacros},
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
