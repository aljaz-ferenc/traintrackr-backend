import {NextResponse} from "next/server";
import {connectToDatabase} from "@/database/mongoose";
import MesocycleModel from "@/database/models/Mesocycle.model";
import WorkoutLogModel from "@/database/models/WorkoutLog.model";

export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export async function PUT(request: Request) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const {weekNumber, workout, mesoId} = body
        console.log(workout.exercises[0])

        const workoutLog = await WorkoutLogModel.findOne({mesoId})

        if(!workoutLog){
            throw new Error('WorkoutLog not found')
        }

        const setsToInsert = workout.exercises.flatMap((exercise) =>
            exercise.sets.map((set) => ({
                weight: set.weight,
                reps: set.reps,
                id: set.id,
            }))
        );

        workoutLog.weeks[weekNumber - 1].workouts.push(workout);

        const updatedLog = await workoutLog.save()

        return NextResponse.json(
            {data: updatedLog},
            {
                status: 201,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    } catch (error) {
        console.error("Error updating workout log:", error);

        return NextResponse.json(
            {message: "Internal Server Error"},
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    }
}
