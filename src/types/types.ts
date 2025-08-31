export type Range = 'today' | 'week' |'month' | 'year'
export type Exercise = {
    id: string;
    name: string;
    primaryMuscle: string;
    secondaryMuscles: string[];
};