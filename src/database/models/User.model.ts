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
        mesocycle: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Mesocycle',
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    }
})

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)
export default UserModel
