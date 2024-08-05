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

// Semesters
router.route("/semesters").get(teacherController.getAllSemesters);
router.route("/semester/:id").get(teacherController.getSingleSemester);

// Subjects
router.route("/subjects").get(teacherController.getAllSubjects);
router.route("/subject/:id").get(teacherController.getSingleSubject);

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

// Divisions
router.route("/divisions").get(teacherController.getAllDivisions);
router.route("/division/:id").get(teacherController.getSingleDivision);

// Teachers
router.route("/teachers").get(teacherController.getAllTeachers);
router.route("/teacher/:id").get(teacherController.getSingleTeacher);
router.route("/teacher").post(teacherController.saveTeacher);

// Division Subject Teachers
router.route("/teacher-divisions").get(teacherController.getAllTeacherDivisions);
router.route("/teacher-subjects-by-division").get(teacherController.getTeacherSubjectsByDivision);

// Student
router.route("/students").get(teacherController.getAllStudents);
router.route("/student/:id").get(teacherController.getSingleStudent);

// Assignments
router.route("/assignments").get(teacherController.getAllAssignments);
router.route("/assignment/:id").get(teacherController.getSingleAssignment);
router.route("/assignment").post(teacherController.saveAssignment);

router.route("/students-by-assignment/:assignmentId").get(teacherController.getStudentsByAssignment);
router.route("/submitted-assignment/:submittedAssignmentId").get(teacherController.getSubmittedAssignment);

// Events
router.route("/events").get(teacherController.getAllEvents);
router.route("/event/:eventId").get(teacherController.getSingleEvent);
router.route("/event").post(teacherController.saveEvent);
router.route("/event/:eventId").delete(teacherController.deleteEvent);

router.route("/join-event-organisers").post(teacherController.joinEventOrganisers);
router.route("/join-event-participants").post(teacherController.joinEventParticipants);
router.route("/remove-event-participant/:eventParticipantId").delete(teacherController.deleteEventParticipants);
router.route("/event-organisers-approval-status").post(teacherController.setEventOrganiserApprovalStatus);

export default router;
