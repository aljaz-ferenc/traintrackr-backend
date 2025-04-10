import mongoose from 'mongoose'

const setSchema = new mongoose.Schema({
    weight: {
        type: Number,
        // required: ['required'],
    },
    reps: {
        type: Number,
        // required: ['required']
    },
    id: {
        type: String,
        // required: ['required']
    }
})

const exerciseWithSetsSchema = new mongoose.Schema({
    sets: {
        type: [setSchema],
        // required: ['required']
    }
})

const logWeekSchema = new mongoose.Schema({
    weekNumber: {
        type: Number,
    },
    workouts: {
        type: [exerciseWithSetsSchema],
    }
})

const workoutLogSchema = new mongoose.Schema({
    mesoTitle: {
        type: String,
        required: ['required']
    },
    mesoId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Mesocycle',
        required: ['required']
    },
    mesoDuration: {
        type: Number,
        required: ['required']
    },
    includeDeload: {
        type: Boolean,
        required: ['required']
    },
    splitType: {
        type: String,
        enum: ['synchronous', 'asynchronous'],
        required: ['required']
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: ['required']
    },
    weeks: {
        type: [logWeekSchema],
        // required: ['required']
    }
})

const WorkoutLogModel = mongoose.models.WorkoutLog || mongoose.model('WorkoutLog', workoutLogSchema)
export default WorkoutLogModel