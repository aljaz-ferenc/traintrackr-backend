import {NextResponse} from "next/server";
import {connectToDatabase} from "@/database/mongoose";
import MesocycleModel from "@/database/models/Mesocycle.model";

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

export async function GET() {
    try{
        await connectToDatabase()

        const mesocycles = await MesocycleModel.find()

    return NextResponse.json({ mesocycles}, {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    });
    }catch(error){
        return NextResponse.json(
            {message: 'Error getting mesocycles'},
            {status: 500}
        )
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const newMesocycle = await request.json();
        const createdMesocycle = await MesocycleModel.create(newMesocycle);

        return NextResponse.json(
            { data: createdMesocycle },
            {
                status: 201,
                headers: {
                    "Access-Control-Allow-Origin": "*", // CORS fix
                },
            }
        );
    } catch (error) {
        console.error("Error creating mesocycle:", error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*", // ✅ Also add here!
                },
            }
        );
    }
}
