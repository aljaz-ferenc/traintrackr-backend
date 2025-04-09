import {NextRequest, NextResponse} from "next/server";
import MesocycleModel from "@/database/models/Mesocycle.model";

export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}


export async function DELETE(request: NextRequest, {params}: {params: Promise<{mesoId: string}>}){
    try{
        const {mesoId} = await params
        const deletedMeso = await MesocycleModel.findByIdAndDelete(mesoId)

        return NextResponse.json({}, {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            status: 200
        })
    }catch(err){
        console.log(err)
        return NextResponse.json({error: 'No mesoId'}, {status: 404})
    }
}

export async function GET(request: NextRequest, {params}: {params: Promise<{mesoId: string}>}){
    try{
        const {mesoId} = await params
        const mesocycle = await MesocycleModel.findById(mesoId)

        return NextResponse.json({mesocycle}, {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            status: 200
        })
    }catch(err){
        console.log(err)
        return NextResponse.json({error: 'No mesoId'}, {status: 404})
    }
}