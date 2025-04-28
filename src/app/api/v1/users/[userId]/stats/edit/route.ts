import {type NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/database/mongoose";
import UserModel, {type IUser} from "@/database/models/User.model";

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PATCH",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        },
    );
}

export async function PATCH(
    request: NextRequest,
    {params}: { params: Promise<{ userId: string }> },
) {
    try {
        const {userId} = await params;
        const payload = await request.json();

        const user = await UserModel.findById(userId)

        if (!user) {
            throw new Error('User not found')
        }

        if (payload.weight) {
            const oldWeight = user.stats.weight.pop()
            const newWeight = {...oldWeight, date: oldWeight.date, value: payload.weight}
            user.stats.weight.push(newWeight)
            user.save()
        }

        if(payload.bodyPart){
            const {name, value} = payload.bodyPart
            user.stats.bodyParts[name].push({value, date: new Date()})
            user.save()
        }

        return NextResponse.json(null, {
            status: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {data: null},
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
    }
}
