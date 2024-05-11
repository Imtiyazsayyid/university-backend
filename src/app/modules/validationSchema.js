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

const subjectSchema = z.object({
  name: z
    .string({ required_error: "Subject Name is required" })
    .min(3, "Subject Name is too short")
    .max(100, "Subject Name is too long"),
  abbr: z
    .string({ required_error: "Subject Abbreviation is required" })
    .min(1, "Subject Abbreviation is too short")
    .max(20, "Subject Abbreviation is too long"),
  code: z
    .string({ required_error: "Subject Code is required" })
    .min(3, "Subject Code is too short")
    .max(45, "Subject Code is too long"),
  credits: z.number({
    required_error: "Credits are required",
    invalid_type_error: "Credits are required",
  }),
  subjectTypeId: z.number({
    required_error: "Subject Type is required",
    invalid_type_error: "Subject Type is required",
  }),
});

const unitSchema = z.object({
  name: z
    .string({ required_error: "Unit Name is required" })
    .min(3, "Unit Name is too short")
    .max(100, "Unit Name is too long"),
  number: z.number({
    required_error: "Unit Number is required",
    invalid_type_error: "Unit Number is required",
  }),
  subjectId: z.number({
    required_error: "Subject is required",
    invalid_type_error: "Subject is required",
  }),
});

const unitMaterialSchema = z.object({
  name: z
    .string({ required_error: "Unit Name is required" })
    .min(3, "Unit Name is too short")
    .max(100, "Unit Name is too long"),

  link: z.string({ required_error: "File is required" }).min(3, "File is required"),

  unitId: z.number({
    required_error: "Unit is required",
    invalid_type_error: "Unit is required",
  }),
});

const batchSchema = z.object({
  year: z.number({
    required_error: "Year is required",
    invalid_type_error: "Year is required",
  }),
  courseId: z.number({
    required_error: "Course is required",
    invalid_type_error: "Course is required",
  }),
});

export { courseSchema, semesterSchema, subjectSchema, unitSchema, unitMaterialSchema, batchSchema };
