import mongoose from "mongoose";
import { foodItemSchema } from "@/database/models/FoodItem.model";

const nutritionSchema = new mongoose.Schema({
	amount: {
		type: Number,
		required: [true, "required"],
	},
	createdBy: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "User",
		required: [true, "required"],
	},
	date: {
		type: Date,
		required: [true, "required"],
	},
	item: {
		type: foodItemSchema,
		required: [true, "required"],
	},
});

const NutritionModel =
	mongoose.models.Nutrition || mongoose.model("Nutrition", nutritionSchema);
export default NutritionModel;
