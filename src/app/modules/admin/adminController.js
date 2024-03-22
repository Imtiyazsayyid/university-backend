import statusType from "../../../@core/enum/statusTypes";
import logger from "../../../@core/services/LoggingService";
import { sendResponse } from "../../../@core/services/ResponseService";
import prisma from "../../../@core/helpers/prisma";
import { courseSchema, semesterSchema, subjectSchema, unitMaterialSchema, unitSchema } from "../validationSchema";

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

// Subjects
export async function getAllSubjects(req, res) {
  try {
    let { currentPage, itemsPerPage, semesterId, searchText, subjectTypeId } = req.query;

    if (!semesterId) return sendResponse(res, true, null, "Send Semester ID");

    let pagination = {};

    if (itemsPerPage && currentPage) {
      itemsPerPage = parseInt(itemsPerPage);
      currentPage = parseInt(currentPage);

      pagination = {
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      };
    }

    let where = {};

    if (searchText) {
      where = {
        ...where,
        name: {
          contains: searchText,
        },
      };
    }

    if (subjectTypeId) {
      where = {
        ...where,
        subjectTypeId: parseInt(subjectTypeId),
      };
    }

    const subjects = await prisma.subject.findMany({
      include: {
        subjectType: true,
      },
      where: {
        semesterId: parseInt(semesterId),
        ...where,
      },
      ...pagination,
    });

    const subjectCount = await prisma.subject.count({
      where: {
        semesterId: parseInt(semesterId),
      },
    });

    return sendResponse(res, true, { subjects, subjectCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllSemesters", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleSubject(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const subject = await prisma.subject.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, subject, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleSemester", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveSubject(req, res) {
  try {
    const { id, name, abbr, code, subjectTypeId, credits, semesterId, status } = req.body;

    const subjectData = {
      name,
      abbr,
      code,
      credits,
      semesterId,
      subjectTypeId,
      status,
    };

    const validation = subjectSchema.safeParse(subjectData);

    if (!validation.success) {
      return sendResponse(res, false, null, "Please Provide All Details.");
    }

    if (id) {
      const updatedSubject = await prisma.subject.update({
        data: subjectData,
        where: {
          id,
        },
      });
    } else {
      const newSubject = await prisma.subject.create({
        data: subjectData,
      });
    }

    return sendResponse(res, true, null, "Subject Saved.");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in saveSubject", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function deleteSubject(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkSubject = await prisma.subject.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkSubject) return sendResponse(res, true, null, "Semester Does Not Exists.");

    const deletedSubject = await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedSubject, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in deleteSemester", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Subject Types
export async function getAllSubjectTypes(req, res) {
  try {
    let { currentPage, itemsPerPage } = req.query;

    let pagination = {};

    if (itemsPerPage && currentPage) {
      itemsPerPage = parseInt(itemsPerPage);
      currentPage = parseInt(currentPage);

      pagination = {
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      };
    }

    const subjectTypes = await prisma.subjectType.findMany({
      ...pagination,
    });

    const subjectTypeCount = await prisma.subjectType.count();

    return sendResponse(res, true, { subjectTypes, subjectTypeCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllSubjectTypes", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Units
export async function getAllUnits(req, res) {
  try {
    let { currentPage, itemsPerPage, subjectId, searchText } = req.query;

    if (!subjectId) return sendResponse(res, true, null, "Send Subject ID");

    let pagination = {};

    if (itemsPerPage && currentPage) {
      itemsPerPage = parseInt(itemsPerPage);
      currentPage = parseInt(currentPage);

      pagination = {
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      };
    }

    let where = {};

    if (searchText) {
      where = {
        ...where,
        name: {
          contains: searchText,
        },
      };
    }

    const units = await prisma.unit.findMany({
      where: {
        subjectId: parseInt(subjectId),
        ...where,
      },
      ...pagination,
    });

    const unitCount = await prisma.unit.count({
      where: {
        subjectId: parseInt(subjectId),
      },
    });

    return sendResponse(res, true, { units, unitCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllUnits", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleUnit(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const unit = await prisma.unit.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, unit, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleUnit", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveUnit(req, res) {
  try {
    const { id, name, number, description, subjectId, status } = req.body;

    const unitData = {
      name,
      number,
      description,
      subjectId,
      status,
    };

    const validation = unitSchema.safeParse(unitData);

    if (!validation.success) {
      return sendResponse(res, false, null, "Please Provide All Details.");
    }

    if (id) {
      const updatedUnit = await prisma.unit.update({
        data: unitData,
        where: {
          id,
        },
      });
    } else {
      const newUnit = await prisma.unit.create({
        data: unitData,
      });
    }

    return sendResponse(res, true, null, "Unit Saved.");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in saveUnit", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function deleteUnit(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkUnit = await prisma.unit.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkUnit) return sendResponse(res, true, null, "Unit Does Not Exists.");

    const deletedUnit = await prisma.unit.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedUnit, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in deleteSemester", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Unit Material
export async function getAllUnitMaterial(req, res) {
  try {
    let { currentPage, itemsPerPage, unitId, searchText } = req.query;

    if (!unitId) return sendResponse(res, true, null, "Send Unit ID");

    let pagination = {};

    if (itemsPerPage && currentPage) {
      itemsPerPage = parseInt(itemsPerPage);
      currentPage = parseInt(currentPage);

      pagination = {
        take: itemsPerPage,
        skip: (currentPage - 1) * itemsPerPage,
      };
    }

    let where = {};

    if (searchText) {
      where = {
        ...where,
        name: {
          contains: searchText,
        },
      };
    }

    const unitMaterials = await prisma.unitMaterial.findMany({
      where: {
        unitId: parseInt(unitId),
        ...where,
      },
      ...pagination,
    });

    const unitMaterialsCount = await prisma.unitMaterial.count({
      where: {
        unitId: parseInt(unitId),
      },
    });

    return sendResponse(res, true, { unitMaterials, unitMaterialsCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllUnitMaterials", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleUnitMaterial(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const unit = await prisma.unitMaterial.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, unit, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleUnitMaterial", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveUnitMaterial(req, res) {
  try {
    const { id, name, link, description, unitId, status } = req.body;

    const unitMaterialData = {
      name,
      link,
      description,
      unitId: unitId ? parseInt(unitId) : null,
      status,
    };

    const validation = unitMaterialSchema.safeParse(unitMaterialData);

    if (!validation.success) {
      console.log(validation.error.errors);

      return sendResponse(res, false, null, "Please Provide All Details.");
    }

    if (id) {
      const updatedUnitMaterial = await prisma.unitMaterial.update({
        data: unitMaterialData,
        where: {
          id,
        },
      });
    } else {
      const newUnitMaterial = await prisma.unitMaterial.create({
        data: unitMaterialData,
      });
    }

    return sendResponse(res, true, null, "Unit Material Saved.");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in saveUnitMaterial", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function deleteUnitMaterial(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkUnitMaterial = await prisma.unitMaterial.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkUnitMaterial) return sendResponse(res, true, null, "Unit Material Does Not Exists.");

    const deletedUnitMaterial = await prisma.unitMaterial.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedUnitMaterial, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in deleteSemester", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}
