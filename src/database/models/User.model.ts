import mongoose, { type InferSchemaType } from "mongoose";

const measurementSchema = new mongoose.Schema({
    value: Number,
    date: Date,
}, { _id: false });

const bodyPartsSchema = new mongoose.Schema({
    neck: { type: [measurementSchema], default: [] },
    shoulders: { type: [measurementSchema], default: [] },
    chest: { type: [measurementSchema], default: [] },
    belly: { type: [measurementSchema], default: [] },
    glutes: { type: [measurementSchema], default: [] },
    leftCalf: { type: [measurementSchema], default: [] },
    rightCalf: { type: [measurementSchema], default: [] },
    leftLeg: { type: [measurementSchema], default: [] },
    rightLeg: { type: [measurementSchema], default: [] },
    leftArm: { type: [measurementSchema], default: [] },
    rightArm: { type: [measurementSchema], default: [] },
    leftForearm: { type: [measurementSchema], default: [] },
    rightForearm: { type: [measurementSchema], default: [] },
}, { _id: false });

const statsSchema = new mongoose.Schema({
    weight: [{ value: Number, date: Date }],
    gender: { type: String, enum: ['male', 'female'] },
    height: Number,
    dob: Date,
    tdee: Number,
    activityLevel: { type: String, enum: ['sedentary','light','moderate','veryActive','extraActive'] },
    bodyParts: { type: bodyPartsSchema, default: () => ({}) },
}, { _id: false });

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: [true, "Clerk id is required"] },
    email: { type: String, required: [true, "email is required"] },
    username: String,
    firstName: String,
    lastName: String,
    image: String,
    lastWorkout: Date,
    calorieGoal: Number,
    units: { type: String, enum: ['imperial','metric'] },
    activeMesocycle: {
        mesocycle: { type: mongoose.SchemaTypes.ObjectId, ref: "Mesocycle" },
        startDate: Date,
        endDate: Date,
    },
    stats: { type: statsSchema, default: () => ({}) }
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
export type IUser = InferSchemaType<typeof userSchema>;
