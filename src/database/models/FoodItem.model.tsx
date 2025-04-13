import mongoose from 'mongoose'

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'required']
    },
    calories: {
        type: Number,
        required: [true, 'required']
    },
    protein: {
        type: Number,
        required: [true, 'required']
    },
    fat: {
        type: Number,
        required: [true, 'required']
    },
    carbs: {
        type: Number,
        required: [true, 'required']
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'required']
    }
})

const FoodItemModel = mongoose.models.FoodItem || mongoose.model('FoodItem', foodItemSchema)
export default FoodItemModel