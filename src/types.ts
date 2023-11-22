import mongoose from "mongoose";
import { z } from "zod";

export const user_login_schema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const user_object_schema = z.object({
    email: z.string().email(),
    name: z.string(),
    last_names: z.string(),
    language: z.enum(["Spanish", "English"]),
    units: z.enum(["Lt", "Gal"]),
    profile_picture: z.string().nullable(),
    password: z.string(),
    username: z.string()
});

export const activity_object_schema = z.object({
    user: z.string().email(),
    activity: z.number(),
    litters_saved: z.number(),
    created_at: z.date()
});

export type UserLoginType = z.infer<typeof user_login_schema>;
export type UserType = z.infer<typeof user_object_schema>;
export type ActivityType = z.infer<typeof activity_object_schema>;

export const UserSchema = new mongoose.Schema<UserType>({
    email: String,
    name: String,
    last_names: String,
    username: String,
    password: String,
    units: String,
    language: String,
    profile_picture: String,
});

export const ActivitySchema = new mongoose.Schema<ActivityType>({
    user: String,
    activity: Number,
    created_at: Date,
    litters_saved: Number
});

export const User = mongoose.model("Users", UserSchema);
export const Activity = mongoose.model("Activities", ActivitySchema);