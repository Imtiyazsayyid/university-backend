import z from "zod";

const allowedGenders = ["male", "female", "other"];

const storySchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(2, "Title is too short").max(100, "Title is too long"),
  content: z.string({ required_error: "Content is required" }).min(2, "Content is too short"),
});

const writerSchema = z.object({
  firstName: z
    .string({ required_error: "First Name is required" })
    .min(2, "First Name is too short")
    .max(50, "First Name is too long"),
  lastName: z
    .string({ required_error: "Last Name is required" })
    .min(2, "Last Name is too short")
    .max(50, "Last Name is too long"),
  username: z
    .string({ required_error: "Username is required" })
    .min(2, "Username is too short")
    .max(50, "Username is too long"),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(3, "Password is too short")
    .max(45, "Password is too long"),
  gender: z.string({ required_error: "Gender is required" }).refine((data) => allowedGenders.includes(data), {
    message: "Invalid gender",
  }),
});

export { storySchema, writerSchema };
