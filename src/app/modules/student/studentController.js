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
