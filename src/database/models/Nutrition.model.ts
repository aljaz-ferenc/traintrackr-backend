import mongoose, {type InferSchemaType, type Types} from "mongoose";
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
	item: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'FoodItem',
		required: [true, "required"],
	},
	createdAt: {
		type: Date,
		required: [true, "required"],
	}
});

const NutritionModel =
	mongoose.models.Nutrition || mongoose.model("Nutrition", nutritionSchema);
export default NutritionModel;
export type INutrition = InferSchemaType<typeof nutritionSchema> & { _id: Types.ObjectId };
