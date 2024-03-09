import { sendResponse } from "../../../@core/services/ResponseService";
import statusType from "../../../@core/enum/statusTypes";
import logger from "../../../@core/services/LoggingService";
import { validateLogin, validateRegister } from "../../../@core/helpers/validationHelper";
import prisma from "../../../@core/helpers/prisma";
import { hash } from "../../../@core/securityService/CryptoClient";
import { checkEmail } from "../../../@core/helpers/validationHelper";
import {
  jwtAccessTokenEncode,
  jwtDecode,
  jwtRefreshTokenEncode,
  jwtRefreshTokenVerify,
} from "../../../@core/securityService/JwtClient";

export async function login(req, res) {
  try {
    const body = {
      email: req.body.email,
      password: req.body.password,
      user_role: req.body.user_role,
    };

    let user;

    if (body.user_role === "admin") {
      user = await prisma.admin.findUnique({
        where: {
          email: body.email,
          status: true,
        },
      });
    }

    if (!user) {
      return sendResponse(res, false, null, "Incorrect Email.");
    }

    if (user.password !== body.password) {
      return sendResponse(res, false, null, "Incorrect Password.");
    }

    const payload = { user_id: user.id, user_role: body.user_role };
    const refreshToken = jwtRefreshTokenEncode(payload);

    return sendResponse(res, true, refreshToken, "Login Successfull");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in login", error);
    return sendResponse(res, false, null, "Error in login", statusType.DB_ERROR);
  }
}

export async function register(req, res) {
  try {
    const body = {
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mobile: req.body.mobile,
    };

    const validate = validateRegister(body);
    if (!validate) {
      return sendResponse(res, false, null, "Fields validation failed!");
    }

    const insertUser = await prisma.u_user.create({
      data: {
        user_email: body.email,
        user_mobile: body.mobile,
        user_password: hash(body.password),
        user_first_name: body.firstname,
        user_last_name: body.lastname,
        user_role_id: 2,
      },
    });

    const payload = { user_id: insertUser.user_id };
    const refreshToken = jwtRefreshTokenEncode(payload);

    return sendResponse(res, true, refreshToken, "Registration Successfull");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in register", error);
    return sendResponse(res, false, null, "Error in register", statusType.DB_ERROR);
  }
}

export async function getAccessToken(req, res) {
  try {
    const refreshToken = req.body.refreshToken;

    const decoded = jwtRefreshTokenVerify(refreshToken);

    if (!decoded) {
      return sendResponse(res, false, null, "Refresh Token Not Valid", statusType.UNAUTHORIZED);
    }

    let user;

    if (decoded.user_role === "admin") {
      user = await prisma.admin.findUnique({
        where: {
          id: decoded.user_id,
          status: true,
        },
      });
    }

    if (!user) {
      return sendResponse(res, false, null, "No such user!");
    }

    const payload = { user_id: user.id, user_role: decoded.user_role };
    const accessToken = jwtAccessTokenEncode(payload);

    return sendResponse(res, true, accessToken, "Access Token");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAccessToken", error);
    return sendResponse(res, false, null, "Error in getting access token", statusType.DB_ERROR);
  }
}
