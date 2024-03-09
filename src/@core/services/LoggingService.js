import winston from "winston";
import fs from "fs";
import path from "path";

import logType from "../enum/logType";

class LoggingService {
  constructor() {
    this.DEBUG_LOGGING_ON =
      (process.env.NODE_ENV && process.env.NODE_ENV) === "production"
        ? false
        : true;

    const logDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    this.logger = winston.createLogger({
      levels: winston.config.npm.levels,
      level: logType.DEBUG,
      // defaultMeta: { service: constant.SERVICE_NAME },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: path.join(logDir, "error.log"), // Use path.join to ensure correct path
          level: "error",
        }),
        new winston.transports.File({
          filename: path.join(logDir, "combined.log"),
        }), // Use path.join to ensure correct path
      ],
    });
  }

  getWinstonLogger() {
    return this.logger;
  }

  consoleLog(route, message, error = null, level = logType.VERBOSE) {
    if (error || level == logType.ERROR || level == logType.WARNING) {
      this.consoleErrorLog(route, message, error);
    } else if (
      level == logType.VERBOSE ||
      level == logType.INFO ||
      level == logType.DEBUG
    ) {
      this.consoleDebugLog(route, message);
    }
  }

  consoleErrorLog(route, message, error) {
    this.logger.error({ route, message, error });
  }

  consoleInfoLog(route, message) {
    if (!this.DEBUG_LOGGING_ON) return;

    this.logger.info({ route, message });
  }
}

const logger = new LoggingService();
export default logger;
