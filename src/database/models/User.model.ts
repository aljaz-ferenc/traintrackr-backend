import mongoose, {type InferSchemaType, type Types} from "mongoose";

const userWeightSchema = new mongoose.Schema({
	value: {
		type: Number,
	},
	date: {
		type: Date,
	},
	// units: {
	//     type: String,
	//     enum: ['kg', 'lb'],
	//     default: 'kg'
	// }
});

const userStatsSchema = new mongoose.Schema({
	weight: {
		type: userWeightSchema,
	},
});

const userSchema = new mongoose.Schema({
	clerkId: {
		type: String,
		required: ["required"],
	},
	email: {
		type: String,
		required: ["required"],
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
	tdee: {
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
		}
	},
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
export type IUser = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };
