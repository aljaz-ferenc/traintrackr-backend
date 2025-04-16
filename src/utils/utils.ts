import UserModel, {IUser} from "@/database/models/User.model";
import {
    addDays,
    differenceInDays,
    endOfToday,
    getDay, isAfter,
    isBefore,
    startOfDay,
    subDays,
    subMonths,
    subWeeks,
    subYears
} from "date-fns";
import mongoose from "mongoose";
import {Range} from "@/types/types";
import MesocycleModel, {IMesocycle} from "@/database/models/Mesocycle.model";
import WorkoutLogModel, {IWorkoutLog} from "@/database/models/WorkoutLog.model";

export function calcActiveMesoProgress(user: IUser) {
    if(!user.activeMesocycle) return null

    const {startDate, endDate} = user.activeMesocycle
    if(!startDate || !endDate) return null

    const daysSinceMesoStart = differenceInDays(subDays(startOfDay(new Date()), 1), startOfDay(startDate))
    const mesoLength = differenceInDays(startOfDay(endDate), startOfDay(startDate))

    const progress = Math.round(daysSinceMesoStart / mesoLength * 100)

    return Math.min(progress, 100)
}

export async function getWeightsByRange(user: IUser, range: Range ){
    if(!user.stats?.weight) return null

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
            break
    }

    return UserModel.aggregate([
        {$match: {_id: new mongoose.Types.ObjectId(user._id)}},
        {$unwind: "$stats.weight"},
        {
            $match: {
                "stats.weight.date": {$gte: fromDate},
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

export async function getCompletedWorkoutsRatio(user: IUser){
    const activeMeso: IMesocycle | null = await MesocycleModel.findById(user.activeMesocycle?.mesocycle)
    if(!activeMeso?.duration) return null

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

    return {total: activeMeso.duration * activeMeso.workouts.length, completed: completedWorkouts}
}

export async function getStatuses(user: IUser, meso: IMesocycle) {
    const workoutDays = meso.workouts.map(workout => workout.day)

    const log: IWorkoutLog | null = await WorkoutLogModel.findOne({mesoId: user.activeMesocycle?.mesocycle})

    const completedWorkoutsDates = log?.weeks.map(week => {
        return week.workouts
            .filter((workout: IMesocycle['workouts'][0]) => workout.completedAt)
            .map(workout => startOfDay((workout.completedAt)).toISOString())
    }).flat()


    const days = []

    if (user.activeMesocycle?.startDate && user.activeMesocycle.endDate) {
        const mesoStartDate = user.activeMesocycle.startDate
        const mesoEndDate = subDays(user.activeMesocycle.endDate, 1)

        let currentDate = mesoStartDate

        while (isBefore(currentDate, mesoEndDate)) {
            const currentDateString = startOfDay(currentDate).toISOString()
            const dayNumber = getDay(currentDateString)

            const wasCompleted = completedWorkoutsDates?.includes(currentDateString)
            const status = wasCompleted
                ? 'completed'
                : isAfter(currentDate, new Date())
                    ? 'upcoming'
                    : workoutDays.includes(dayNumber)
                        ? 'missed'
                        : 'rest';


            days.push({ date: currentDate, status })

            currentDate = addDays(currentDate, 1)
        }
    }
    return days
}
