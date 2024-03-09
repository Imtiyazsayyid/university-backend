import statusType from "@core/enum/statusTypes";
import prisma from "@core/helpers/prisma";
import logger from "@core/services/LoggingService";

export default async function writeMiddleware(req, res, next) {
  try {
    const module_role_map = await prisma.module_role_map.findFirst({
      where: {
        mrm_role_id: userInfo.user_role_id,
        mrm_module_id: userInfo.module_id,
        mrm_access: "WRITE",
        mrm_is_active: true,
      },
    });

    if (!module_role_map) {
      return sendResponse(
        res,
        false,
        null,
        "Write Access required",
        statusType.UNAUTHORIZED
      );
    }
    next();
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in writeMiddleware ", error);
    return sendResponse(
      res,
      false,
      null,
      "Error in checking write access ",
      statusType.INTERNAL_SERVER_ERROR
    );
  }
}
