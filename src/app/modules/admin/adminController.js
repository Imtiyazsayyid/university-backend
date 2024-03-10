import statusType from "../../../@core/enum/statusTypes";
import logger from "../../../@core/services/LoggingService";
import { sendResponse } from "../../../@core/services/ResponseService";
import prisma from "../../../@core/helpers/prisma";
import { courseSchema, semesterSchema, storySchema } from "../validationSchema";

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
    logger.consoleErrorLog(req.originalUrl, "Error in getAdminDetails", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Courses
export async function getAllCourses(req, res) {
  try {
    let { searchText, currentPage, itemsPerPage } = req.query;

    itemsPerPage = parseInt(itemsPerPage);
    currentPage = parseInt(currentPage);

    let where = {};

    if (searchText) {
      where = {
        ...where,
        name: {
          contains: searchText,
        },
      };
    }

    const courses = await prisma.course.findMany({
      where,
      take: itemsPerPage,
      skip: (currentPage - 1) * itemsPerPage,
    });

    const courseCount = await prisma.course.count({
      where,
    });

    return sendResponse(res, true, { courses, courseCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllCourses", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleCourse(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, course, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleCourse", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveCourse(req, res) {
  try {
    const {
      id,
      name,
      abbr,
      duration,
      description,
      programOutcome,
      departmentalStrength,
      aboutFacility,
      eligibilty,
      significance,
      vision,
      mission,
      technicalActivities,
      status,
    } = req.body;

    const courseData = {
      name,
      abbr,
      duration,
      description,
      programOutcome,
      departmentalStrength,
      aboutFacility,
      eligibilty,
      significance,
      vision,
      mission,
      technicalActivities,
      status,
    };

    const validation = courseSchema.safeParse(courseData);
    if (!validation.success) {
      return sendResponse(res, false, null, "Please Provide All Details.");
    }

    if (id) {
      const updatedCourse = await prisma.course.update({
        data: courseData,
        where: {
          id,
        },
      });
    } else {
      const newCourse = await prisma.course.create({
        data: courseData,
      });
    }

    return sendResponse(res, true, null, "Course Saved.");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in saveCourse", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function deleteCourse(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkCourse = await prisma.course.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkCourse) return sendResponse(res, true, null, "Course Does Not Exists.");

    const deletedCourse = await prisma.course.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedCourse, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in deleteCourse", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Semesters
export async function getAllSemesters(req, res) {
  try {
    let { currentPage, itemsPerPage, courseId } = req.query;

    if (!courseId) return sendResponse(res, true, null, "Send Course ID");

    itemsPerPage = parseInt(itemsPerPage);
    currentPage = parseInt(currentPage);

    const semesters = await prisma.semester.findMany({
      where: {
        courseId: parseInt(courseId),
      },
      take: itemsPerPage,
      skip: (currentPage - 1) * itemsPerPage,
      orderBy: {
        semNumber: "asc",
      },
    });

    const semesterCount = await prisma.semester.count({
      where: {
        courseId: parseInt(courseId),
      },
    });

    return sendResponse(res, true, { semesters, semesterCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllSemesters", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleSemester(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const semester = await prisma.semester.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, semester, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleSemester", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveSemester(req, res) {
  try {
    const { id, semNumber, duration, status, courseId } = req.body;

    const semesterData = {
      semNumber,
      duration,
      status,
      courseId,
    };

    const validation = semesterSchema.safeParse(semesterData);
    if (!validation.success) {
      return sendResponse(res, false, null, "Please Provide All Details.");
    }

    if (id) {
      const updatedSemester = await prisma.semester.update({
        data: semesterData,
        where: {
          id,
        },
      });
    } else {
      const newSemester = await prisma.semester.create({
        data: semesterData,
      });
    }

    return sendResponse(res, true, null, "Semester Saved.");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in saveSemester", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function deleteSemester(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkSemester = await prisma.semester.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkSemester) return sendResponse(res, true, null, "Semester Does Not Exists.");

    const deletedSemester = await prisma.semester.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedSemester, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in deleteSemester", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}
