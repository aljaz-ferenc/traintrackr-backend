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
        if(!mesoId) throw new Error('No mesoId')

        const deletedMeso = await MesocycleModel.findByIdAndDelete(mesoId)
        if(!deletedMeso) throw new Error('Coudn not delete mesocycle')

        return NextResponse.json({}, {status: 204})
    }catch(err){
        return NextResponse.json({error: 'No mesoId'}, {status: 404})
    }
}