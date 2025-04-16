import {IUser} from "@/database/models/User.model";
import {differenceInDays, startOfDay, subDays} from "date-fns";

export function calcActiveMesoProgress(user: IUser) {
    if(!user.activeMesocycle) return null

    const {startDate, endDate} = user.activeMesocycle
    if(!startDate || !endDate) return null

    const daysSinceMesoStart = differenceInDays(subDays(startOfDay(new Date()), 1), startOfDay(startDate))
    const mesoLength = differenceInDays(startOfDay(endDate), startOfDay(startDate))

    const progress = Math.round(daysSinceMesoStart / mesoLength * 100)

    return Math.min(progress, 100)
}
