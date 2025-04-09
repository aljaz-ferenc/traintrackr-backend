import mongoose from 'mongoose'

const mesocycleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: ['required']
    },
    duration: {
        type: Number,
        required: ['required']
    },
    includeDeload: {
        type: Boolean,
        required: ['required']
    },
    splitType: {
        enum: ['synchronized' ,'asynchronized'],
        required: ['required']
    },
    workouts: {
      type: Array,
      required: ['required']
    },
    createdBy: {
        //TODO: ObjectId
        type: String,
        required: ['required']
    }
})

const MesocycleModel = mongoose.models.Mesocycle || mongoose.model('Mesocycle', mesocycleSchema)
export default MesocycleModel
