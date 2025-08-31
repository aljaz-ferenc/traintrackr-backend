import { NextResponse } from "next/server";
import {generateObject} from "ai";
import {google} from "@ai-sdk/google";
import {z} from "zod";
import {exercises} from "@/constants/exercises";
import { v4 as uuidv4 } from 'uuid';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const workoutSchema = z.object({
    day: z.number().min(1).max(7),
    exercises: z.string().array()
})

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
    const { daysPerWeek, userPrompt } = await request.json();

    console.log(exercises.length)
    const {object} = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: workoutSchema.array(),
        system: `You are an experienced personal trainer specialized in creating efficient workout plans.
                 You will structure a weekly workout plan for a mesocycle based on user's input.
                 Only create a plan for **one week**, which will be repeated for the whole mesocycle.
                 The user provides the number of days per week they want to train and additional info.
                 Each workout should contain multiple exercises. Use **only** these exercises: ${JSON.stringify(exercises)}
                 Each exercise has a primary muscle and secondary muscles. Unless the user specifies a specialization program, try to balance workouts so that each major muscle group is trained appropriately and secondary muscles are not overworked. 
                 Distribute the workouts across the 7-day week so they are not on consecutive days. 
                 For example, if the user wants 3 workouts, you could assign them to Monday, Wednesday, and Friday (1, 3, 5). 
                 If the user wants 4 workouts, you could assign them to Monday, Tuesday, Thursday, and Saturday (1, 2, 4, 6). 
                 Use your best judgment to balance recovery and muscle groups.

                 Try to select between 5 and 7 exercises per day, unless specified differently by the user.
                 IMPORTANT: Return an array of workouts. Each workout represents a day (1 = Monday, 7 = Sunday).
                 For each exercise, only return the "id". These will be populated programmatically later.
                 Only return valid JSON matching the schema, with no extra text.`
        ,
        prompt: `The user wants to train ${daysPerWeek} day a week, so you should return an array or ${daysPerWeek} workouts. This is the additional info from the user (possibly in Slovene (sl-si) language), which you should base your workout plan on: ${userPrompt}`
    })

    const generatedWorkouts = object.map(workout => ({
        ...workout,
        id: uuidv4(),
        exercises: workout.exercises
            .map(id => exercises.find(ex => ex.id === id))
            .filter(Boolean),
    }));


    return NextResponse.json(
        generatedWorkouts ,
        { status: 200, headers: corsHeaders }
    );
}
