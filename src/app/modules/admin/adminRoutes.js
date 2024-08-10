import express from "express";
const router = express.Router();

import * as adminController from "./adminController";
import authRoutes from "../authentication/authenticationRoutes";
import adminMiddleware from "../../middlewares/adminMiddleware";

router.use("/auth", authRoutes);
router.use(adminMiddleware);

// Admin Detials
router.route("/details").get(adminController.getAdminDetails);

// Courses
router.route("/courses").get(adminController.getAllCourses);
router.route("/course/:id").get(adminController.getSingleCourse);
router.route("/course").post(adminController.saveCourse);
router.route("/course/:id").delete(adminController.deleteCourse);

// Semesters
router.route("/semesters").get(adminController.getAllSemesters);
router.route("/semester/:id").get(adminController.getSingleSemester);
router.route("/semester").post(adminController.saveSemester);
router.route("/semester/:id").delete(adminController.deleteSemester);

// Subjects
router.route("/subjects").get(adminController.getAllSubjects);
router.route("/subject/:id").get(adminController.getSingleSubject);
router.route("/subject").post(adminController.saveSubject);
router.route("/subject/:id").delete(adminController.deleteSubject);

// Subject Types
router.route("/subject-types").get(adminController.getAllSubjectTypes);

// Units
router.route("/units").get(adminController.getAllUnits);
router.route("/unit/:id").get(adminController.getSingleUnit);
router.route("/unit").post(adminController.saveUnit);
router.route("/unit/:id").delete(adminController.deleteUnit);

// Unit Material
router.route("/unit-material").get(adminController.getAllUnitMaterial);
router.route("/unit-material/:id").get(adminController.getSingleUnitMaterial);
router.route("/unit-material").post(adminController.saveUnitMaterial);
router.route("/unit-material/:id").delete(adminController.deleteUnitMaterial);

// Unit Quiz
router.route("/unit-quiz").get(adminController.getAllUnitQuizes);
router.route("/unit-quiz/:id").get(adminController.getSingleUnitQuiz);
router.route("/unit-quiz").post(adminController.saveUnitQuiz);
router.route("/unit-quiz/:id").delete(adminController.deleteUnitQuiz);

// Batchs
router.route("/batches").get(adminController.getAllBatches);
router.route("/batch/:id").get(adminController.getSingleBatch);
router.route("/batch").post(adminController.saveBatch);
router.route("/batch/:id").delete(adminController.deleteBatch);

// Divisions
router.route("/divisions").get(adminController.getAllDivisions);
router.route("/division/:id").get(adminController.getSingleDivision);
router.route("/division").post(adminController.saveDivision);
router.route("/division/:id").delete(adminController.deleteDivision);

// Teachers
router.route("/teachers").get(adminController.getAllTeachers);
router.route("/teacher/:id").get(adminController.getSingleTeacher);
router.route("/teacher").post(adminController.saveTeacher);
router.route("/teacher/:id").delete(adminController.deleteTeacher);

// Division Subject Teachers
router.route("/division-subject-teachers").get(adminController.getAllDivisionSubjectTeachers);
router.route("/division-subject-teacher").post(adminController.saveDivisionSubjectTeacher);

// Student
router.route("/students").get(adminController.getAllStudents);
router.route("/student/:id").get(adminController.getSingleStudent);
router.route("/student").post(adminController.saveStudent);
router.route("/student/:id").delete(adminController.deleteStudent);

// Event
router.route("/events").get(adminController.getAllEvents);
router.route("/event/:eventId").get(adminController.getSingleEvent);
router.route("/event").post(adminController.saveEvent);

// ----------------- Masters -------------------------

// Teacher Roles
router.route("/teacher-roles").get(adminController.getAllTeacherRoles);
router.route("/teacher-role/:id").get(adminController.getSingleTeacherRole);
router.route("/teacher-role").post(adminController.saveTeacherRole);
router.route("/teacher-role/:id").delete(adminController.deleteTeacherRole);

// Student Documents Roles
router.route("/student-documents").get(adminController.getAllStudentDocuments);
router.route("/student-document/:id").get(adminController.getSingleStudentDocument);
router.route("/student-document").post(adminController.saveStudentDocument);
router.route("/student-document/:id").delete(adminController.deleteStudentDocument);

// Subject Types
router.route("/subject-type").post(adminController.saveSubjectType);
router.route("/subject-type/:id").delete(adminController.deleteSubjectType);

export default router;
