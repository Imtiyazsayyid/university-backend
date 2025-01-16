import statusType from "../../../@core/enum/statusTypes";
import { getIntOrNull } from "../../../@core/helpers/commonHelpers";
import prisma from "../../../@core/helpers/prisma";
import logger from "../../../@core/services/LoggingService";
import { sendResponse } from "../../../@core/services/ResponseService";

export async function createDailyTimeTable(req, res) {
  try {
    const timeTables = await prisma.timeTable.findMany();
    let currentDate = new Date();
    let dayOfWeek = currentDate.toLocaleString("en-us", { weekday: "long" }).toLowerCase();

    let divisionWiseTimeTables = {};

    for (let timeTable of timeTables) {
      if (!divisionWiseTimeTables[`${timeTable.divisionId}`]) {
        divisionWiseTimeTables[`${timeTable.divisionId}`] = [timeTable];
      } else {
        divisionWiseTimeTables[`${timeTable.divisionId}`].push(timeTable);
      }
    }

    const data = [];

    for (let divisionId in divisionWiseTimeTables) {
      let currentDivisionTimeTable = divisionWiseTimeTables[divisionId];

      for (let timeTableRow of currentDivisionTimeTable) {
        data.push({
          subjectId: timeTableRow[dayOfWeek],
          todaysDate: currentDate,
          divisionId: parseInt(divisionId),
          startTime: timeTableRow.startTime,
          endTime: timeTableRow.endTime,
        });
      }
    }

    // await prisma.dailyTimeTable.createMany({
    //   data,
    // });

    return sendResponse(res, true, data, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getTimeTable", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}
