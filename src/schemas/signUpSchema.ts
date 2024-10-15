import { z } from "zod"


export const usernameValidation = z
    .string()
    .min(4, "Username should be atleast of 4 character")
    .max(20, "Username should be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message:"Password must be atleast of 6 characters"})
})