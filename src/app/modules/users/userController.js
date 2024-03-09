import core from "../../../@core/core";

export async function Function(req, res) {
  try {
    return core.sendResponse(res, true, null, "Api Not Ready Yet");
  } catch (error) {
    core.logger.consoleErrorLog(
      req.originalUrl,
      "Error in functionName",
      error
    );
    return core.sendResponse(
      res,
      false,
      null,
      "Error ",
      core.statusType.DB_ERROR
    );
  }
}
