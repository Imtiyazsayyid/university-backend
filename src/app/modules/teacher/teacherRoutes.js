import express from "express";
const router = express.Router();

import * as teacherController from "./teacherController";
import authRoutes from "../authentication/authenticationRoutes";
import teacherMiddleware from "../../middlewares/teacherMiddleware";

router.use("/auth", authRoutes);
router.use(teacherMiddleware);

// Teacher Details
router.route("/details").get(teacherController.getTeacherDetails);

// Courses
router.route("/courses").get(teacherController.getAllCourses);
router.route("/course/:id").get(teacherController.getSingleCourse);
router.route("/course").post(teacherController.saveCourse);
router.route("/course/:id").delete(teacherController.deleteCourse);

// Semesters
router.route("/semesters").get(teacherController.getAllSemesters);
router.route("/semester/:id").get(teacherController.getSingleSemester);
router.route("/semester").post(teacherController.saveSemester);
router.route("/semester/:id").delete(teacherController.deleteSemester);

// Subjects
router.route("/subjects").get(teacherController.getAllSubjects);
router.route("/subject/:id").get(teacherController.getSingleSubject);
router.route("/subject").post(teacherController.saveSubject);
router.route("/subject/:id").delete(teacherController.deleteSubject);

// Subject Types
router.route("/subject-types").get(teacherController.getAllSubjectTypes);

// Units
router.route("/units").get(teacherController.getAllUnits);
router.route("/unit/:id").get(teacherController.getSingleUnit);
router.route("/unit").post(teacherController.saveUnit);
router.route("/unit/:id").delete(teacherController.deleteUnit);

// Unit Material
router.route("/unit-material").get(teacherController.getAllUnitMaterial);
router.route("/unit-material/:id").get(teacherController.getSingleUnitMaterial);
router.route("/unit-material").post(teacherController.saveUnitMaterial);
router.route("/unit-material/:id").delete(teacherController.deleteUnitMaterial);

// Unit Quiz
router.route("/unit-quiz").get(teacherController.getAllUnitQuizes);
router.route("/unit-quiz/:id").get(teacherController.getSingleUnitQuiz);
router.route("/unit-quiz").post(teacherController.saveUnitQuiz);
router.route("/unit-quiz/:id").delete(teacherController.deleteUnitQuiz);

// Batchs
router.route("/batches").get(teacherController.getAllBatches);
router.route("/batch/:id").get(teacherController.getSingleBatch);
router.route("/batch").post(teacherController.saveBatch);
router.route("/batch/:id").delete(teacherController.deleteBatch);

// Divisions
router.route("/divisions").get(teacherController.getAllDivisions);
router.route("/division/:id").get(teacherController.getSingleDivision);
router.route("/division").post(teacherController.saveDivision);
router.route("/division/:id").delete(teacherController.deleteDivision);

// Teachers
router.route("/teachers").get(teacherController.getAllTeachers);
router.route("/teacher/:id").get(teacherController.getSingleTeacher);
router.route("/teacher").post(teacherController.saveTeacher);
router.route("/teacher/:id").delete(teacherController.deleteTeacher);

// Division Subject Teachers
router.route("/division-subject-teachers").get(teacherController.getAllDivisionSubjectTeachers);
router.route("/division-subject-teacher").post(teacherController.saveDivisionSubjectTeacher);

// Student
router.route("/students").get(teacherController.getAllStudents);
router.route("/student/:id").get(teacherController.getSingleStudent);
router.route("/student").post(teacherController.saveStudent);
router.route("/student/:id").delete(teacherController.deleteStudent);

// ----------------- Masters -------------------------
// Teacher Roles
router.route("/teacher-roles").get(teacherController.getAllTeacherRoles);
router.route("/teacher-role/:id").get(teacherController.getSingleTeacherRole);
router.route("/teacher-role").post(teacherController.saveTeacherRole);
router.route("/teacher-role/:id").delete(teacherController.deleteTeacherRole);

// Student Documents Roles
router.route("/student-documents").get(teacherController.getAllStudentDocuments);
router.route("/student-document/:id").get(teacherController.getSingleStudentDocument);
router.route("/student-document").post(teacherController.saveStudentDocument);
router.route("/student-document/:id").delete(teacherController.deleteStudentDocument);

export default router;
