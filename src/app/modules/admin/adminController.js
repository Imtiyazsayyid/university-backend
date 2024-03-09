import statusType from "../../../@core/enum/statusTypes";
import logger from "../../../@core/services/LoggingService";
import { sendResponse } from "../../../@core/services/ResponseService";
import prisma from "../../../@core/helpers/prisma";
import { storySchema } from "../validationSchema";

// Admin Details
export async function getAdminDetails(req, res) {
  try {
    const { id } = req.app.settings.userInfo;

    const admin = await prisma.admin.findUnique({
      where: {
        id,
      },
    });

    return sendResponse(res, true, admin, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllDonors", error);
    return sendResponse(res, false, null, "Error ", statusType.DB_ERROR);
  }
}
