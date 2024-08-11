import { getIntOrNull } from "@/@core/helpers/commonHelpers";
import statusType from "../../../@core/enum/statusTypes";
import prisma from "../../../@core/helpers/prisma";
import logger from "../../../@core/services/LoggingService";
import { sendResponse } from "../../../@core/services/ResponseService";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { MYSQL_MOMENT_DATETIME_FORMAT } from "@/@core/helpers/constant";
import getPrismaPagination from "@/app/helpers/prismaPaginationHelper";
import { likeIfValue } from "@/app/helpers/prismaHelpers";

// Admin Details
export async function getStudentDetails(req, res) {
  try {
    const { id } = req.app.settings.userInfo;

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    return sendResponse(res, true, student, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Batch
export async function getStudentBatch(req, res) {
  try {
    const { id } = req.app.settings.userInfo;

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    const batch = await prisma.batch.findUnique({
      include: {
        course: true,
        accessibleSemesters: {
          include: {
            semester: {
              include: {
                subjects: true,
              },
            },
          },
        },
      },
      where: {
        id: student.batchId,
      },
    });

    return sendResponse(res, true, batch, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Subject
export async function getSingleSubject(req, res) {
  try {
    const { subjectId } = req.params;
    const { id } = req.app.settings.userInfo;

    if (!getIntOrNull(subjectId)) return sendResponse(res, false, null, "Send Valid Subject ID", statusType.DB_ERROR);

    const division = await prisma.student.findUnique({
      select: {
        divisionId: true,
      },
      where: {
        id,
      },
    });

    const subject = await prisma.subject.findUnique({
      include: {
        units: true,
        divisionTeachers: {
          include: {
            teacher: {
              include: {
                role: true,
              },
            },
          },
          where: {
            divisionId: division.divisionId,
            subjectId: parseInt(subjectId),
            status: true,
          },
        },
      },
      where: {
        id: parseInt(subjectId),
      },
    });

    return sendResponse(res, true, subject, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export const getAccessibleSubjects = async (req, res) => {
  try {
    const { id } = req.app.settings.userInfo;

    const student = await prisma.student.findUnique({
      include: {
        batch: {
          include: {
            accessibleSemesters: {
              include: {
                semester: {
                  include: {
                    subjects: true,
                  },
                },
              },
              orderBy: {
                semester: {
                  semNumber: "desc",
                },
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    let subjects = [];

    for (let accessibleSemester of student.batch.accessibleSemesters) {
      accessibleSemester.semester.subjects.forEach((s) => subjects.push(s));
    }

    return sendResponse(res, true, subjects, "success");
  } catch (error) {
    console.error("Error in getAccessibleSubjects", error);
    return sendResponse(res, false, null, "Error In Getting Accessible Subjects", statusType.DB_ERROR);
  }
};

// Unit Material
export async function getSingleUnit(req, res) {
  try {
    const { unitId } = req.params;

    const unit = await prisma.unit.findUnique({
      include: {
        subject: true,
        unitMaterial: true,
        unitQuizes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
          where: {
            status: true,
          },
        },
      },
      where: {
        id: parseInt(unitId),
      },
    });

    return sendResponse(res, true, unit, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleUnitQuiz(req, res) {
  try {
    const { id } = req.app.settings.userInfo;
    const { quizId } = req.params;

    const quiz = await prisma.unitQuiz.findUnique({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
      where: {
        id: parseInt(quizId),
      },
    });

    return sendResponse(res, true, quiz, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Submit Unit Quiz
export async function saveUnitQuiz(req, res) {
  try {
    const { id: studentId } = req.app.settings.userInfo;
    const { responses, quizId } = req.body;
    const attemptId = uuidv4();

    const formattedResponses = responses.map((r) => ({
      attemptId,
      selectedOptionId: r.optionId,
      unitQuizQuestionId: r.questionId,
      unitQuizId: quizId,
      studentId,
    }));

    await prisma.unitQuizQuestionResponses.createMany({
      data: formattedResponses,
    });

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Get All Responses
export async function getAllQuizResponses(req, res) {
  try {
    const { id: studentId } = req.app.settings.userInfo;
    const { quizId } = req.query;

    if (!quizId) {
      return sendResponse(res, false, null, "Send Quiz ID", statusType.BAD_REQUEST);
    }

    const responses = await prisma.unitQuizQuestionResponses.findMany({
      include: {
        selectedOption: true,
      },
      where: {
        unitQuizId: parseInt(quizId),
        studentId,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    let responsesByAttemptId = {};

    for (let response of responses) {
      if (!responsesByAttemptId[`${response.attemptId}`]) {
        responsesByAttemptId[`${response.attemptId}`] = [];
      }

      responsesByAttemptId[`${response.attemptId}`].push(response);
    }

    let finalResponses = [];

    for (let key in responsesByAttemptId) {
      let obj = {
        attemptId: key,
        date: responsesByAttemptId[key][0].created_at,
        responses: responsesByAttemptId[key],
      };

      finalResponses.push(obj);
    }

    console.log({ finalResponses });

    return sendResponse(res, true, finalResponses, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Assignments
export async function getAllAssignments(req, res) {
  try {
    const { id: studentId } = req.app.settings.userInfo;
    const { search, subjectId, status } = req.query;

    console.log({ status });

    const student = await prisma.student.findUnique({
      select: {
        divisionId: true,
      },
      where: {
        id: studentId,
      },
    });

    let where = {};

    if (search) {
      where = {
        ...where,
        name: {
          contains: search,
        },
      };
    }

    if (getIntOrNull(subjectId)) {
      where = {
        ...where,
        subjectId: parseInt(subjectId),
      };
    }

    if (status) {
      const now = new Date();

      if (status === "pending") {
        where = {
          ...where,
          submittedAssignments: {
            none: {
              studentId,
            },
          },
          dueDate: {
            gt: now,
          },
        };
      } else if (status === "closed") {
        where = {
          ...where,
          submittedAssignments: {
            none: {
              studentId,
            },
          },
          dueDate: {
            lte: now,
          },
        };
      } else if (status === "complete") {
        where = {
          ...where,
          submittedAssignments: {
            some: {
              studentId,
            },
          },
        };
      }
    }

    const assignments = await prisma.assignment.findMany({
      include: {
        teacher: {
          include: {
            role: true,
          },
        },
        subject: true,
        submittedAssignments: {
          where: {
            studentId,
          },
        },
      },
      where: {
        ...where,
        divisionId: student.divisionId,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    const assignmentCount = await prisma.assignment.count({
      where: {
        divisionId: student.divisionId,
      },
    });

    return sendResponse(res, true, { assignments, assignmentCount }, "Success");
  } catch (error) {
    console.error(error);
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleAssignment(req, res) {
  try {
    const { id: studentId } = req.app.settings.userInfo;
    const { assignmentId } = req.params;

    if (!getIntOrNull(assignmentId)) {
      return sendResponse(res, true, null, "Please Send Valid Assignment ID");
    }

    const student = await prisma.student.findUnique({
      select: {
        divisionId: true,
      },
      where: {
        id: studentId,
      },
    });

    const assignment = await prisma.assignment.findUnique({
      include: {
        questions: {
          where: {
            status: true,
          },
        },
        subject: true,
        material: {
          where: {
            status: true,
          },
        },
        assignmentUploads: {
          where: {
            studentId,
            status: true,
          },
        },
        responses: {
          where: {
            studentId,
          },
        },
      },
      where: {
        id: parseInt(assignmentId),
        divisionId: student.divisionId,
        status: true,
      },
    });

    const checkSubmitted = await prisma.assignmentsSubmitted.findFirst({
      where: {
        studentId,
        assignmentId: parseInt(assignmentId),
      },
    });

    const data = {
      ...assignment,
      isSubmitted: checkSubmitted ? true : false,
    };

    return sendResponse(res, true, data, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function submitAssignment(req, res) {
  try {
    const { id: studentId } = req.app.settings.userInfo;
    const { assignmentId, assignmentAnswers, assignmentUploads, action } = req.body;

    if (!getIntOrNull(assignmentId)) {
      return sendResponse(res, true, null, "Please Send Assignment ID");
    }

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: parseInt(assignmentId),
      },
    });

    if (moment().isAfter(moment(assignment.dueDate))) {
      return sendResponse(res, true, null, "Due Date Has Passed");
    }

    // Assignment Answers

    await prisma.assignmentQuestionResponses.updateMany({
      data: {
        status: false,
      },
      where: {
        assignmentId: assignment.id,
        studentId,
      },
    });

    if (assignmentAnswers && assignmentAnswers.length) {
      for (let assignmentResponse of assignmentAnswers) {
        let obj = {
          answer: assignmentResponse.answer,
          assignmentId: assignment.id,
          assignmentQuestionId: assignmentResponse.questionId,
          studentId,
          status: true,
        };

        if (assignmentResponse.db_id) {
          await prisma.assignmentQuestionResponses.update({
            data: obj,
            where: {
              id: assignmentResponse.db_id,
            },
          });
        } else {
          await prisma.assignmentQuestionResponses.create({
            data: obj,
          });
        }
      }
    }

    // Assignment Uploads

    await prisma.assignmentUploads.updateMany({
      data: {
        status: false,
      },
      where: {
        assignmentId: assignment.id,
        studentId,
      },
    });

    if (assignmentUploads && assignmentUploads.length) {
      for (let upload of assignmentUploads) {
        await prisma.assignmentUploads.create({
          data: {
            material_url: upload,
            assignmentId: assignment.id,
            studentId,
          },
        });
      }
    }

    if (action === "submit") {
      await prisma.assignmentsSubmitted.create({
        data: {
          assignmentId: assignment.id,
          studentId,
        },
      });
    }

    if (action === "update") {
      await prisma.assignmentsSubmitted.updateMany({
        data: {
          updated_at: moment(),
        },
        where: {
          assignmentId: assignment.id,
          studentId,
        },
      });
    }

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Events
export async function getAllEvents(req, res) {
  let { searchText, currentPage, itemsPerPage } = req.query;

  try {
    const options = {};
    likeIfValue(options, ["name"], searchText);

    const where = {
      approvalStatus: "approved",
      eventFor: {
        in: ["all", "students"],
      },
    };

    const events = await prisma.event.findMany({
      ...getPrismaPagination(currentPage, itemsPerPage),
      include: {
        eventParticipants: {
          include: {
            student: true,
          },
        },
        eventHead: {
          include: {
            role: true,
          },
        },
      },
      where: {
        ...options.where,
        ...where,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const eventCount = await prisma.event.count({ where });

    return sendResponse(res, true, { events, eventCount }, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleEvent(req, res) {
  try {
    const { id: studentId } = req.app.settings.userInfo;

    const eventId = getIntOrNull(req.params.eventId);

    if (!eventId) return sendResponse(res, true, null, "Send Valid Event ID");

    const event = await prisma.event.findUnique({
      include: {
        eventOrganisers: {
          include: {
            teacher: true,
          },
        },
        eventHead: {
          include: {
            role: true,
          },
        },
        eventParticipants: {
          include: {
            teacher: true,
            student: true,
          },
        },
      },
      where: {
        approvalStatus: "approved",
        eventFor: {
          in: ["all", "students"],
        },
        id: eventId,
      },
    });

    return sendResponse(res, true, event, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getStudentDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function joinEventParticipants(req, res) {
  try {
    const { id: studentId } = req.app.settings.userInfo;
    const { eventId } = req.body;

    if (!eventId) {
      return sendResponse(res, false, null, "Send All Details");
    }

    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
        approvalStatus: "approved",
      },
    });

    if (!event) {
      return sendResponse(res, false, null, "No Such Event");
    }

    if (event.isCompleted) return sendResponse(res, false, null, "You Cannot Join A Complete Event");

    const now = moment();
    if (event.finalRegistrationDate && now.isAfter(moment(event.finalRegistrationDate))) {
      return sendResponse(res, false, null, "Registration For this Event is Closed.");
    }

    // const isEventHead = await prisma.event.findUnique({
    //   where: {
    //     id: parseInt(eventId),
    //     eventHeadId: teacherId,
    //   },
    // });

    // if (isEventHead) {
    //   return sendResponse(res, false, null, "You are already the head of this event.");
    // }

    const existingParticipant = await prisma.eventParticipant.findFirst({
      where: {
        eventId: parseInt(eventId),
        studentId,
      },
    });

    if (existingParticipant) {
      return sendResponse(res, false, null, "You are already a participant for this event.");
    }

    await prisma.eventParticipant.create({
      data: {
        eventId: parseInt(eventId),
        studentId,
      },
    });

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function leaveEvent(req, res) {
  try {
    const { id: studentId } = req.app.settings.userInfo;
    const eventId = getIntOrNull(req.params.eventId);

    const existingParticipant = await prisma.eventParticipant.findFirst({
      include: {
        event: true,
      },
      where: {
        eventId,
        studentId,
      },
    });

    if (!existingParticipant) {
      return sendResponse(res, false, null, "You are not a participant for this event.");
    }

    if (existingParticipant.event.isCompleted)
      return sendResponse(res, false, null, "You Cannot Leave A Completed Event");

    if (existingParticipant.studentId !== studentId) {
      return sendResponse(res, false, null, "You Do Not Have Access To Remove Someone Else From this Event");
    }

    await prisma.eventParticipant.delete({
      where: {
        id: existingParticipant.id,
      },
    });

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}
