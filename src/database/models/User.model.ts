import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: ['required']
    },
    email: {
        type: String,
        required: ['required']
    },
    username: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    image: {
        type: String
    },
    activeMesocycle: {
        mesoId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Mesocycle',
        },
        startDate: Date,
        endDate: Date
    }
})

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)
export default UserModel
