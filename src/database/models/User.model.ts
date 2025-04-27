import mongoose, {type InferSchemaType, type Types} from "mongoose";

const measurementSchema = new mongoose.Schema({
	value: Number,
	date: Date
}, {_id: false})

const userSchema = new mongoose.Schema({
	clerkId: {
		type: String,
		required: [true, "Clerk id is required"],
	},
	email: {
		type: String,
		required: [true, "email is required"],
	},
	username: {
		type: String,
	},
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	image: {
		type: String,
	},
	lastWorkout: {
		type: Date,
	},
	calorieGoal: {
		type: Number
	},
	units: {
		type: String,
		enum: ['imperial', 'metric']
	},
	activeMesocycle: {
		mesocycle: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Mesocycle",
		},
		startDate: {
			type: Date,
		},
		endDate: {
			type: Date,
		},
	},
	stats: {
		weight: [
			{
				value: Number,
				date: Date,
			},
		],
		gender: {
			type: String,
			enum: ['male', 'female']
		},
		height: {
			type: Number
		},
		dob: {
			type: Date
		},
		tdee: {
			type: Number
		},
		activityLevel: {
			type: String,
			enum: ['sedentary', 'light', 'moderate', 'veryActive', 'extraActive']
		},
		bodyParts: {
			neck: {type: [measurementSchema], default: []},
			shoulders: {type: [measurementSchema], default: []},
			chest: {type: [measurementSchema], default: []},
			belly: {type: [measurementSchema], default: []},
			glutes: {type: [measurementSchema], default: []},
			leftCalf: {type: [measurementSchema], default: []},
			rightCalf: {type: [measurementSchema], default: []},
			leftLeg: {type: [measurementSchema], default: []},
			rightLeg: {type: [measurementSchema], default: []},
			leftArm: {type: [measurementSchema], default: []},
			rightArm: {type: [measurementSchema], default: []},
			leftForearm: {type: [measurementSchema], default: []},
			rightForearm: {type: [measurementSchema], default: []},
		},
		default: {}
	},
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
export type IUser = InferSchemaType<typeof userSchema>;
