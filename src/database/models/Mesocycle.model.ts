import mongoose from "mongoose";

const mesocycleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: ["required"],
	},
	duration: {
		type: Number,
		required: ["required"],
	},
	includeDeload: {
		type: Boolean,
		required: ["required"],
	},
	splitType: {
		type: String,
		enum: ["synchronous", "asynchronous"],
		required: ["required"],
	},
	workouts: {
		type: Array,
		required: ["required"],
	},
	createdBy: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "User",
		required: ["required"],
	},
});

const MesocycleModel =
	mongoose.models.Mesocycle || mongoose.model("Mesocycle", mesocycleSchema);
export default MesocycleModel;
