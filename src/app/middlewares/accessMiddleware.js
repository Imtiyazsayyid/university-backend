import statusType from "@core/enum/statusTypes";
import prisma from "@core/helpers/prisma";
import { jwtAccessTokenVerify } from "@core/securityService/JwtClient";
import logger from "@core/services/LoggingService";

export default function accessMiddleware(module_key) {
  return async function (req, res, next) {
    try {
      const decoded = jwtAccessTokenVerify(req.headers.Authorization);

      if (!decoded) {
        return sendResponse(
          res,
          false,
          null,
          "Token Invalid",
          statusType.FORBIDDEN
        );
      }

      const user = await prisma.u_user.findUnique({
        where: { user_id: decoded.user_id },
      });

      if (!user) {
        return sendResponse(
          res,
          false,
          null,
          "No Such User",
          statusType.FORBIDDEN
        );
      }

      const module_role_map = await prisma.module_role_map.findFirst({
        where: {
          mrm_role_id: user.user_role_id,
          mrm_module_relation: {
            module_key: module_key,
          },
        },
      });

      if (!module_role_map) {
        return sendResponse(
          res,
          false,
          null,
          "This role is not Authorized for this module",
          statusType.UNAUTHORIZED
        );
      }

      req.userInfo = {
        ...user,
        module_id: module_role_map.mrm_module_id,
      };
      next();
    } catch (error) {
      logger.consoleErrorLog(
        req.originalUrl,
        "Error in accessMiddleware ",
        error
      );
      return sendResponse(
        res,
        false,
        null,
        "Error in validating token",
        statusType.INTERNAL_SERVER_ERROR
      );
    }
  };
}
