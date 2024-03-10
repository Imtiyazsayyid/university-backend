import z from "zod";

const allowedGenders = ["male", "female", "other"];

const courseSchema = z.object({
  name: z
    .string({ required_error: "Course Name is required" })
    .min(3, "Course Name is too short")
    .max(100, "Course Name is too long"),
  abbr: z
    .string({ required_error: "Course Abbreviation is required" })
    .min(1, "Course Abbreviation is too short")
    .max(20, "Course Abbreviation is too long"),
  duration: z.number({
    required_error: "Duration is required",
    invalid_type_error: "Duration is required",
  }),
});

const semesterSchema = z.object({
  duration: z.number({
    required_error: "Duration is required",
    invalid_type_error: "Duration is required",
  }),
  semNumber: z.number({
    required_error: "Sem Number is required",
    invalid_type_error: "Sem Number is required",
  }),
});

export { courseSchema, semesterSchema };
