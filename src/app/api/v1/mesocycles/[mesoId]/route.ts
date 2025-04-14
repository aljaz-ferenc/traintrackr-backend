import { type NextRequest, NextResponse } from "next/server";
import MesocycleModel from "@/database/models/Mesocycle.model";
import { connectToDatabase } from "@/database/mongoose";

export async function OPTIONS() {
	return NextResponse.json(
		{},
		{
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		},
	);
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ mesoId: string }> },
) {
	try {
		await connectToDatabase();
		const { mesoId } = await params;
		const deletedMeso = await MesocycleModel.findByIdAndDelete(mesoId);

		return NextResponse.json(
			{},
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
				status: 200,
			},
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "No mesoId" }, { status: 404 });
	}
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ mesoId: string }> },
) {
	try {
		await connectToDatabase();
		const { mesoId } = await params;
		const mesocycle = await MesocycleModel.findById(mesoId);

		return NextResponse.json(
			{ mesocycle },
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
				status: 200,
			},
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "No mesoId" }, { status: 404 });
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ mesoId: string }> },
) {
	try {
		await connectToDatabase();
		const { mesoId } = await params;
		const newMeso = await request.json();
		const updatedMeso = await MesocycleModel.replaceOne(
			{ _id: mesoId },
			newMeso,
		);

		return NextResponse.json(
			{ data: updatedMeso },
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
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
