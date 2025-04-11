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
    id: {
        type: Number // STRING???????
    },
    name: {
        type: String
    },
    primaryMuscle: {
        type: String
    },
    secondaryMuscles: {
      type: [String]
    },
    sets: {
        type: [setSchema],
    }
})

const workoutSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    day: {
        type: Number
    },
    exercises: {
        type: [exerciseWithSetsSchema]
    }
})

const logWeekSchema = new mongoose.Schema({
    weekNumber: {
        type: Number,
    },
    workouts: {
        type: [workoutSchema],
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
