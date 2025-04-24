import '@/database/models/FoodItem.model'
import '@/database/models/Nutrition.model'
import '@/database/models/WorkoutLog.model'
import '@/database/models/Mesocycle.model'
import UserModel, { type IUser } from "@/database/models/User.model";
import {
	addDays,
	differenceInDays,
	endOfToday, endOfWeek,
	getDay,
	isAfter,
	isBefore,
	startOfDay,
	startOfToday, startOfWeek,
	subDays,
	subMonths,
	subWeeks,
	subYears,
} from "date-fns";
import mongoose from "mongoose";
import type { Range } from "@/types/types";
import MesocycleModel, {
	type IMesocycle,
} from "@/database/models/Mesocycle.model";
import WorkoutLogModel, {
	type IWorkoutLog,
} from "@/database/models/WorkoutLog.model";
import NutritionModel, { type INutrition } from "@/database/models/Nutrition.model";

export function calcActiveMesoProgress(user: any) {
	if (!user.activeMesocycle) return null;

	const { startDate, endDate } = user.activeMesocycle;
	if (!startDate || !endDate) return null;

	const daysSinceMesoStart = differenceInDays(
		subDays(startOfDay(new Date()), 1),
		startOfDay(startDate),
	);
	const mesoLength = differenceInDays(
		startOfDay(endDate),
		startOfDay(startDate),
	);

	const progress = Math.round((daysSinceMesoStart / mesoLength) * 100);

	return Math.min(progress, 100);
}

export async function getWeightsInRange(user: any, range: Range) {
	if (!user.stats?.weight) return null;

	const toDate = endOfToday();
	let fromDate: Date;

	switch (range) {
		case "week":
			fromDate = subWeeks(toDate, 1);
			break;
		case "month":
			fromDate = subMonths(toDate, 1);
			break;
		case "year":
			fromDate = subYears(toDate, 1);
			break;
		default:
			fromDate = subWeeks(toDate, 1);
			break;
	}

	return UserModel.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(user._id) } },
		{ $unwind: "$stats.weight" },
		{
			$match: {
				"stats.weight.date": { $gte: fromDate },
			},
		},
		{
			$project: {
				_id: 0,
				value: "$stats.weight.value",
				date: "$stats.weight.date",
			},
		},
	]);
}

export async function getCompletedWorkoutsRatio(user: any) {
	const activeMeso: IMesocycle | null = await MesocycleModel.findById(
		user.activeMesocycle?.mesocycle,
	);
	if (!activeMeso?.duration || !activeMeso.workouts?.length) return {total: null, completed: null};

	const completedWorkouts = await WorkoutLogModel.aggregate([
		{ $match: { mesoId: activeMeso._id } },
		{ $unwind: "$weeks" },
		{ $unwind: "$weeks.workouts" },
		{ $match: { "weeks.workouts.completedAt": { $ne: null } } },
		{
			$group: {
				_id: null,
				totalCompleted: { $sum: 1 },
			},
		},
	]);

	const total = activeMeso.duration * activeMeso.workouts.length;
	const completed = completedWorkouts[0]?.totalCompleted || 0;

	return { total, completed };
}

export async function getStatuses(user: IUser, meso: IMesocycle) {
	const workoutDays = meso.workouts.map((workout) => workout.day);

	const log: IWorkoutLog | null = await WorkoutLogModel.findOne({
		mesoId: user.activeMesocycle?.mesocycle,
	});

	const completedWorkoutsDates = log?.weeks.flatMap((week) => {
		return week.workouts
			.filter((workout: IMesocycle["workouts"][0]) => workout.completedAt)
			.map((workout) => startOfDay(workout.completedAt!).toISOString());
	});

	const days = [];

	if (user.activeMesocycle?.startDate && user.activeMesocycle.endDate) {
		const mesoStartDate = user.activeMesocycle.startDate;
		const mesoEndDate = subDays(user.activeMesocycle.endDate, 1);

		let currentDate = mesoStartDate;

		while (isBefore(currentDate, mesoEndDate)) {
			const currentDateString = startOfDay(currentDate).toISOString();
			const dayNumber = getDay(currentDateString);

			const wasCompleted = completedWorkoutsDates?.includes(currentDateString);
			const status = wasCompleted
				? "completed"
				: isAfter(currentDate, new Date())
					? "upcoming"
					: workoutDays.includes(dayNumber)
						? "missed"
						: "rest";

			days.push({ date: currentDate, status });

			currentDate = addDays(currentDate, 1);
		}
	}
	return days;
}

type Macros = {
	calories: number;
	protein: number;
	fat: number;
	carbs: number;
};

export function calcMacros(nutritions: any) {
	return nutritions.reduce(
		(total: any, current: any) => {
			return {
				calories: Math.round(
					total.calories + (current.amount * current.item.calories) / 100,
				),
				protein: Math.round(
					total.protein + (current.amount * current.item.protein) / 100,
				),
				fat: Math.round(total.fat + (current.amount * current.item.fat) / 100),
				carbs: Math.round(
					total.carbs + (current.amount * current.item.carbs) / 100,
				),
			};
		},
		{ calories: 0, protein: 0, fat: 0, carbs: 0 },
	);
}

export function getStartOfRange(range: Range) {
	const today = startOfToday();

	switch (range) {
		case "today": {
			return today;
		}
		case "week": {
			return subWeeks(today, 1);
		}
		case "month": {
			return subMonths(today, 1);
		}
		case "year": {
			return subYears(today, 1);
		}
		default: {
			return subWeeks(today, 1);
		}
	}
}

export async function getNutritionsByRange(userId: any, range: Range) {
	const startDate = getStartOfRange(range);

	const nutritionsByRange = await NutritionModel.find({
		createdBy: userId,
		createdAt: {
			$gte: startDate,
			$lte: endOfToday(),
		},
	}).populate("item");

	return nutritionsByRange;
}

export async function getWeightChangeInRange(user: any, range: Range){
	const startDate = getStartOfRange(range)
	const endDate = endOfToday()

	const weights = user.stats.weight.filter((w: any) =>
		isAfter(new Date(w.date), startDate) &&
		isBefore(new Date(w.date), endDate)
	) || []
	const firstWeight = weights[0]
	const lastWeight = weights.pop()

	return lastWeight.value - firstWeight.value
}

export async function getWeightChangeBetweenDates(userId: any, startDate: Date, endDate: Date): Promise<{first: number, last: number, change: number}>{
	const weightChangeData = await UserModel.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(userId) } },
		{ $unwind: "$stats.weight" },
		{
			$match: {
				"stats.weight.date": {
					$gte: startDate,
					$lte: endDate,
				},
			},
		},
		{ $sort: { "stats.weight.date": 1 } },
		{
			$group: {
				_id: "$_id",
				first: { $first: "$stats.weight.value" },
				last: { $last: "$stats.weight.value" },
			},
		},
		{
			$project: {
				_id: 0,
				first: "$first",
				last: "$last",
				change: { $subtract: ["$last", "$first"] },
			},
		},
	]);

	return weightChangeData[0]
}
