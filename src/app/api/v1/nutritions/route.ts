import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
    try {
        const nutrition = await request.json();
        console.log(nutrition)
        // await connectToDatabase();
        // await NutritionModel.create(nutrition)

        return NextResponse.json(nutrition, {
            status: 201,
            headers: { "Access-Control-Allow-Origin": "*" }
        });
    } catch (err) {
        console.error("Error creating nutrition:", err);
        return NextResponse.json({ message: 'Error creating nutrition' }, { status: 500 });
    }
}
