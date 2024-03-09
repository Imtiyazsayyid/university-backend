import { sendResponse } from "@core/services/ResponseService";
import statusType from "@core/enum/statusTypes";
import prisma from "@core/helpers/prisma";
import { jwtAccessTokenVerify } from "@core/securityService/JwtClient";
import logger from "@core/services/LoggingService";

export default async function authMiddleware(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || typeof authorization !== "string") {
      logger.consoleInfoLog(req.originalUrl, "No authorization Token Provided");
      return sendResponse(res, false, null, "No authorization Token Provided", statusType.UNAUTHORIZED);
    }

    const decoded = jwtAccessTokenVerify(authorization);

    if (!decoded) {
      return sendResponse(res, false, null, "Token Invalid", statusType.UNAUTHORIZED);
    }

    const user = await prisma.admin.findUnique({
      where: { id: decoded.user_id },
    });

    if (!user) {
      return sendResponse(res, false, null, "No Such User", statusType.UNAUTHORIZED);
    }

    req.app.set("userInfo", user);

    next();
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in accessMiddleware ", error);
    return sendResponse(res, false, null, "Error in validating token", statusType.INTERNAL_SERVER_ERROR);
  }
}
