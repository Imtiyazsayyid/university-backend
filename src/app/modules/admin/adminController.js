import statusType from "../../../@core/enum/statusTypes";
import logger from "../../../@core/services/LoggingService";
import { sendResponse } from "../../../@core/services/ResponseService";
import prisma from "../../../@core/helpers/prisma";
import {
  batchSchema,
  courseSchema,
  semesterSchema,
  subjectSchema,
  unitMaterialSchema,
  unitSchema,
  divisionSchema,
  teacherSchema,
  studentSchema,
} from "../validationSchema";
import getPrismaPagination from "../../helpers/prismaPaginationHelper";
import { getIntOrNull } from "../../../@core/helpers/commonHelpers";
import { likeIfValue, whereIfValue } from "../../helpers/prismaHelpers";

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
      ...getPrismaPagination(currentPage, itemsPerPage),
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

    const semesters = await prisma.semester.findMany({
      where: {
        courseId: parseInt(courseId),
      },
      ...getPrismaPagination(currentPage, itemsPerPage),
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

    const options = {};

    likeIfValue(options, "name", searchText);
    whereIfValue(options, "subjectTypeId", subjectTypeId, getIntOrNull);
    whereIfValue(options, "semesterId", semesterId, getIntOrNull);

    const subjects = await prisma.subject.findMany({
      include: {
        subjectType: true,
      },

      ...options,
      ...getPrismaPagination(currentPage, itemsPerPage),
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

    const subjectTypes = await prisma.subjectType.findMany({
      ...getPrismaPagination(currentPage, itemsPerPage),
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
      ...getPrismaPagination(currentPage, itemsPerPage),
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
      ...getPrismaPagination(currentPage, itemsPerPage),
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

// Batches
export async function getAllBatches(req, res) {
  try {
    let { currentPage, itemsPerPage, courseId, year } = req.query;

    let where = {};

    if (courseId && getIntOrNull(courseId)) {
      where = {
        ...where,
        courseId: getIntOrNull(courseId),
      };
    }

    if (year && getIntOrNull(year)) {
      where = {
        ...where,
        year: getIntOrNull(year),
      };
    }

    const batches = await prisma.batch.findMany({
      where,
      include: {
        course: true,
        divisions: true,
        accessibleSemesters: {
          include: {
            semester: true,
          },
          orderBy: {
            semester: {
              semNumber: "asc",
            },
          },
        },
      },
      ...getPrismaPagination(currentPage, itemsPerPage),
    });

    const batchCount = await prisma.batch.count({
      where,
    });

    return sendResponse(res, true, { batches, batchCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllBatches", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleBatch(req, res) {
  // try {
  let { id } = req.params;

  if (!id) return sendResponse(res, true, null, "Send A Valid ID");

  const batch = await prisma.batch.findUnique({
    include: {
      course: true,
      accessibleSemesters: {
        include: {
          semester: {
            include: {
              subjects: true,
            },
          },
        },
        orderBy: {
          semester: {
            semNumber: "asc",
          },
        },
      },
    },
    where: {
      id: parseInt(id),
    },
  });

  return sendResponse(res, true, batch, "Success");
  // } catch (error) {
  //   logger.consoleErrorLog(req.originalUrl, "Error in getSingleBatch", error);
  //   return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  // }
}

export async function saveBatch(req, res) {
  // try {
  const { id, year, courseId, status, accessibleSemesterIds } = req.body;

  const batchData = {
    year,
    courseId,
    status,
  };

  const validation = batchSchema.safeParse(batchData);
  if (!validation.success) {
    console.log({ errors: validation.error.errors });

    return sendResponse(res, false, null, "Please Provide All Details.");
  }

  let batch;

  if (id) {
    batch = await prisma.batch.update({
      data: batchData,
      where: {
        id,
      },
    });

    await prisma.batchSemesterMap.deleteMany({
      where: {
        batchId: batch.id,
      },
    });
  } else {
    const checkIfBatchExists = await prisma.batch.findFirst({
      where: {
        year,
        courseId,
      },
    });

    if (checkIfBatchExists) {
      return sendResponse(res, false, null, "Batch Already Exists.");
    }

    batch = await prisma.batch.create({
      data: batchData,
    });
  }

  if (accessibleSemesterIds && accessibleSemesterIds.length > 0) {
    await prisma.batchSemesterMap.createMany({
      data: accessibleSemesterIds.map((semesterId) => ({
        semesterId,
        batchId: batch.id,
      })),
    });
  }
  return sendResponse(res, true, null, "Batch Saved.");
  // } catch (error) {
  //   logger.consoleErrorLog(req.originalUrl, "Error in saveBatch", error);
  //   return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  // }
}

export async function deleteBatch(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkBatch = await prisma.batch.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkBatch) return sendResponse(res, true, null, "Batch Does Not Exists.");

    await prisma.batchSemesterMap.deleteMany({
      where: {
        batchId: checkBatch.id,
      },
    });

    const deletedBatch = await prisma.batch.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedBatch, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in deleteBatch", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Divisions
export async function getAllDivisions(req, res) {
  try {
    let { currentPage, itemsPerPage, batchId, searchText } = req.query;

    let options = {};

    if (!getIntOrNull(batchId)) {
      return sendResponse(res, false, null, "Send Batch ID");
    }

    whereIfValue(options, "batchId", batchId, getIntOrNull);
    likeIfValue(options, ["name"], searchText);

    const divisions = await prisma.division.findMany({
      ...options,
      ...getPrismaPagination(currentPage, itemsPerPage),
    });

    const divisionCount = await prisma.division.count(options);

    return sendResponse(res, true, { divisions, divisionCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllDivisions", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleDivision(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const division = await prisma.division.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, division, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleDivision", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveDivision(req, res) {
  // try {
  const { id, batchId, name, status } = req.body;

  const divisionData = {
    name,
    batchId,
    status,
  };

  const validation = divisionSchema.safeParse(divisionData);
  if (!validation.success) {
    console.log({ errors: validation.error.errors });

    return sendResponse(res, false, null, "Please Provide All Details.");
  }

  let division;

  if (id) {
    division = await prisma.division.update({
      data: divisionData,
      where: {
        id,
      },
    });
  } else {
    division = await prisma.division.create({
      data: divisionData,
    });
  }

  return sendResponse(res, true, null, "Division Saved.");
  // } catch (error) {
  //   logger.consoleErrorLog(req.originalUrl, "Error in saveDivision", error);
  //   return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  // }
}

export async function deleteDivision(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkDivision = await prisma.division.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkDivision) return sendResponse(res, true, null, "Division Does Not Exists.");

    const deletedDivision = await prisma.division.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedDivision, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in deleteDivision", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Teachers
export async function getAllTeachers(req, res) {
  try {
    let { searchText, currentPage, itemsPerPage } = req.query;

    const options = {};
    likeIfValue(options, ["firstName", "lastName"], searchText);

    const teachers = await prisma.teacher.findMany({
      include: {
        role: true,
      },
      ...options,
      ...getPrismaPagination(currentPage, itemsPerPage),
    });

    const teacherCount = await prisma.teacher.count(options);

    return sendResponse(res, true, { teachers, teacherCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllTeachers", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleTeacher(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, teacher, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleTeacher", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveTeacher(req, res) {
  try {
    const {
      id,
      firstName,
      lastName,
      email,
      password,
      gender,
      profileImg,
      roleId,
      address,
      qualification,
      experience,
      about,
      awardsAndRecognition,
      guestSpeakerAndResourcePerson,
      participationInCWTP,
      researchPublications,
      certificationCourses,
      booksOrChapter,
      professionalMemberships,
      status,
    } = req.body;

    const teacherData = {
      firstName,
      lastName,
      email,
      password,
      gender,
      profileImg,
      roleId,
      address,
      qualification,
      experience,
      about,
      awardsAndRecognition,
      guestSpeakerAndResourcePerson,
      participationInCWTP,
      researchPublications,
      certificationCourses,
      booksOrChapter,
      professionalMemberships,
      status,
    };

    const validation = teacherSchema.safeParse(teacherData);
    if (!validation.success) {
      return sendResponse(res, false, null, "Please Provide All Details.");
    }

    if (id) {
      const updatedTeacher = await prisma.teacher.update({
        data: teacherData,
        where: {
          id,
        },
      });
    } else {
      const newTeacher = await prisma.teacher.create({
        data: teacherData,
      });
    }

    return sendResponse(res, true, null, "Teacher Saved.");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in saveTeacher", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function deleteTeacher(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkTeacher = await prisma.teacher.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkTeacher) return sendResponse(res, true, null, "Teacher Does Not Exists.");

    const deletedTeacher = await prisma.teacher.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedTeacher, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in deleteTeacher", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Teacher Roles
export async function getAllTeacherRoles(req, res) {
  try {
    let { searchText, currentPage, itemsPerPage } = req.query;

    let where = {};

    if (searchText) {
      where = {
        ...where,
        name: {
          contains: searchText,
        },
      };
    }

    const teacherRoles = await prisma.teacherRole.findMany({
      where,
      ...getPrismaPagination(currentPage, itemsPerPage),
    });

    const teacherRoleCount = await prisma.teacherRole.count({
      where,
    });

    return sendResponse(res, true, { teacherRoles, teacherRoleCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllTeacherRoles", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Subject Teachers
export async function getAllDivisionSubjectTeachers(req, res) {
  try {
    let { divisionId } = req.query;

    if (!divisionId) return sendResponse(res, true, null, "Send A Valid Division ID");

    const divisionSubjectTeachers = await prisma.divisionSubjectTeacher.findMany({
      include: {
        subject: true,
      },
      where: {
        divisionId: parseInt(divisionId),
        status: true,
      },
    });

    return sendResponse(res, true, divisionSubjectTeachers, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleDivision", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveDivisionSubjectTeacher(req, res) {
  // try {
  const { divisionId, teacherId, subjectId } = req.body;

  if (!teacherId) {
    await prisma.divisionSubjectTeacher.updateMany({
      data: {
        status: false,
      },
      where: {
        subjectId: parseInt(subjectId),
        divisionId: parseInt(divisionId),
      },
    });
  } else {
    await prisma.divisionSubjectTeacher.create({
      data: {
        divisionId: parseInt(divisionId),
        teacherId: parseInt(teacherId),
        subjectId: parseInt(subjectId),
      },
    });
  }

  return sendResponse(res, true, null, "Success");
  // } catch (error) {
  //   logger.consoleErrorLog(req.originalUrl, "Error in getSingleDivision", error);
  //   return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  // }
}

// Students
export async function getAllStudents(req, res) {
  try {
    let { searchText, courseId, batchId, divisionId, currentPage, itemsPerPage } = req.query;

    const options = {};
    likeIfValue(options, ["firstName", "lastName"], searchText);
    whereIfValue(options, "courseId", courseId, getIntOrNull);
    whereIfValue(options, "batchId", batchId, getIntOrNull);
    whereIfValue(options, "divisionId", divisionId, getIntOrNull);

    const students = await prisma.student.findMany({
      ...options,
      ...getPrismaPagination(currentPage, itemsPerPage),
      orderBy: {
        rollNumber: "asc",
      },
    });

    const studentCount = await prisma.student.count(options);

    return sendResponse(res, true, { students, studentCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllStudents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleStudent(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, student, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleStudent", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveStudent(req, res) {
  try {
    const {
      id,
      rollNumber,
      firstName,
      lastName,
      email,
      password,
      gender,
      profileImg,
      address,
      courseId,
      batchId,
      divisionId,
      status,
    } = req.body;

    const studentData = {
      rollNumber,
      firstName,
      lastName,
      email,
      password,
      gender,
      profileImg,
      address,
      courseId,
      batchId,
      divisionId,
      status,
    };

    const validation = studentSchema.safeParse(studentData);
    if (!validation.success) {
      console.log({ e: validation.error.errors });
      return sendResponse(res, false, null, "Please Provide All Details.");
    }

    if (id) {
      const updatedStudent = await prisma.student.update({
        data: studentData,
        where: {
          id,
        },
      });
    } else {
      const newStudent = await prisma.student.create({
        data: studentData,
      });
    }

    return sendResponse(res, true, null, "Student Saved.");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in saveStudent", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function deleteStudent(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkStudent = await prisma.student.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkStudent) return sendResponse(res, true, null, "Student Does Not Exists.");

    const deletedStudent = await prisma.student.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedStudent, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in deleteStudent", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}
