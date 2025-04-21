import express from "express";
const router = express.Router();

import * as studentController from "./studentController";
import authRoutes from "../authentication/authenticationRoutes";
import studentMiddleware from "../../middlewares/studentMiddleware";

router.use("/auth", authRoutes);
router.use(studentMiddleware);

// Student Details
router.route("/details").get(studentController.getStudentDetails);

// Batch
router.route("/batch").get(studentController.getStudentBatch);

// Subject
router.route("/subject/:subjectId").get(studentController.getSingleSubject);
router.route("/accessible-subjects").get(studentController.getAccessibleSubjects);

// Unit Materials
router.route("/unit/:unitId").get(studentController.getSingleUnit);
router.route("/unit-quiz/:quizId").get(studentController.getSingleUnitQuiz);
router.route("/unit-quiz").post(studentController.saveUnitQuiz);
router.route("/unit-quiz-responses").get(studentController.getAllQuizResponses);

// Assignments
router.route("/assignments").get(studentController.getAllAssignments);
router.route("/assignment/:assignmentId").get(studentController.getSingleAssignment);
router.route("/assignment").post(studentController.submitAssignment);

// Events
router.route("/events").get(studentController.getAllEvents);
router.route("/event/:eventId").get(studentController.getSingleEvent);
router.route("/join-event-participants").post(studentController.joinEventParticipants);
router.route("/leave-event/:eventId").delete(studentController.leaveEvent);

// Chats
router.route("/chats").get(studentController.getStudentsList);
router.route("/conversations").post(studentController.createStudentConversation);
router.route("/conversations/:conversationId").delete(studentController.deleteStudentConversation);
router.route("/conversations/:conversationId/seen").patch(studentController.updateLastSeenOfStudentMessage);
router.route("/conversations").get(studentController.getStudentConversations);
router.route("/conversations/:conversationId/messages").get(studentController.getNewStudentMessage);
router.route("/conversations/:conversationId/messages").get(studentController.getStudentMessages);
router.route("/conversations/:conversationId").get(studentController.getStudentConversationById);
router.route("/conversations/:conversationId/message").post(studentController.createStudentMessage);

export default router;
