import { getIntOrNull } from "@/@core/helpers/commonHelpers";
import statusType from "../../../@core/enum/statusTypes";
import prisma from "../../../@core/helpers/prisma";
import logger from "../../../@core/services/LoggingService";
import { sendResponse } from "../../../@core/services/ResponseService";

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

// Unit Material
export async function getSingleUnit(req, res) {
  try {
    const { unitId } = req.params;

    const unit = await prisma.unit.findUnique({
      include: {
        subject: true,
        unitMaterial: true,
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
