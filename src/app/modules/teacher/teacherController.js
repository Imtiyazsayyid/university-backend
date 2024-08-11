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
  teacherRoleSchema,
  studentDocumentSchema,
  unitQuizSchema,
} from "../validationSchema";
import getPrismaPagination from "../../helpers/prismaPaginationHelper";
import { getIntOrNull, getObjOrNull, getStringOrNull } from "../../../@core/helpers/commonHelpers";
import { likeIfValue, whereIfValue } from "../../helpers/prismaHelpers";
import moment from "moment";

// Teacher Details
export async function getTeacherDetails(req, res) {
  try {
    const { id } = req.app.settings.userInfo;

    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    return sendResponse(res, true, teacher, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getTeacherDetails", error);
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
      include: {
        documents: {
          include: {
            document: true,
          },
        },
      },
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
      include: {
        documents: true,
      },
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

// Unit Quiz
export async function getAllUnitQuizes(req, res) {
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

    const unitQuizes = await prisma.unitQuiz.findMany({
      where: {
        unitId: parseInt(unitId),
        ...where,
      },
      ...getPrismaPagination(currentPage, itemsPerPage),
    });

    const unitQuizesCount = await prisma.unitQuiz.count({
      where: {
        unitId: parseInt(unitId),
      },
    });

    return sendResponse(res, true, { unitQuizes, unitQuizesCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllUnitMaterials", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleUnitQuiz(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const unit = await prisma.unitQuiz.findUnique({
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, unit, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleunitQuiz", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveUnitQuiz(req, res) {
  // try {
  const { id, name, unitId, status } = req.body;

  const unitQuizData = {
    name,
    unitId: unitId ? parseInt(unitId) : null,
    status,
  };

  const validation = unitQuizSchema.safeParse(unitQuizData);

  if (!validation.success) {
    console.log(validation.error.errors);

    return sendResponse(res, false, null, "Please Provide All Details.");
  }

  let currentQuiz;

  if (id) {
    currentQuiz = await prisma.unitQuiz.update({
      data: unitQuizData,
      where: {
        id: parseInt(id),
      },
    });

    await prisma.unitQuizQuestionResponses.deleteMany({
      where: {
        unitQuizId: parseInt(id),
      },
    });

    await prisma.unitQuizQuestionOption.deleteMany({
      where: {
        unitQuizId: parseInt(id),
      },
    });

    await prisma.unitQuizQuestion.deleteMany({
      where: {
        unitQuizId: parseInt(id),
      },
    });
  } else {
    currentQuiz = await prisma.unitQuiz.create({
      data: unitQuizData,
    });
  }

  const questions = req.body.questions;

  if (questions && questions.length > 0) {
    let index = 0;
    for (let question of questions) {
      const currentQuestion = await prisma.unitQuizQuestion.create({
        data: {
          unitQuizId: currentQuiz.id,
          order: index,
          question: question.question,
        },
      });

      let options = question.options;

      for (let option of options) {
        if (option.value) {
          await prisma.unitQuizQuestionOption.create({
            data: {
              unitQuizId: currentQuiz.id,
              isCorrect: option.isCorrect,
              value: option.value,
              unitQuizQuestionId: currentQuestion.id,
            },
          });
        }
      }

      index++;
    }
  }

  return sendResponse(res, true, null, "Unit Quiz Saved.");
  // } catch (error) {
  //   logger.consoleErrorLog(req.originalUrl, "Error in saveUnitQuiz", error);
  //   return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  // }
}

export async function deleteUnitQuiz(req, res) {
  try {
    let { id } = req.params;

    if (!id) return sendResponse(res, true, null, "Send A Valid ID");

    const checkUnitQuiz = await prisma.unitQuiz.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!checkUnitQuiz) return sendResponse(res, true, null, "Unit Quiz Does Not Exists.");

    await prisma.unitQuizQuestionOption.deleteMany({
      where: {
        unitQuizId: parseInt(id),
      },
    });

    await prisma.unitQuizQuestion.deleteMany({
      where: {
        unitQuizId: parseInt(id),
      },
    });

    const deletedUnitQuiz = await prisma.unitQuiz.delete({
      where: {
        id: parseInt(id),
      },
    });

    return sendResponse(res, true, deletedUnitQuiz, "Success");
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
      include: {
        batch: {
          include: {
            course: true,
          },
        },
      },
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
export async function getAllTeacherDivisions(req, res) {
  try {
    let { id } = req.app.settings.userInfo;

    const divisionSubjectTeachers = await prisma.divisionSubjectTeacher.findMany({
      where: {
        teacherId: id,
        status: true,
      },
    });

    const teacherDivisionIds = [...new Set(divisionSubjectTeachers.map((dst) => dst.divisionId))];

    const divisions = await prisma.division.findMany({
      include: {
        batch: {
          include: {
            course: true,
          },
        },
      },
      where: {
        id: {
          in: teacherDivisionIds,
        },
      },
    });

    return sendResponse(res, true, divisions, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllTeacherDivisions", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getTeacherSubjectsByDivision(req, res) {
  try {
    let { id } = req.app.settings.userInfo;
    let { divisionId } = req.query;

    const subjectsByDivisionTeacher = await prisma.divisionSubjectTeacher.findMany({
      include: {
        subject: true,
      },
      where: {
        divisionId: parseInt(divisionId),
        teacherId: id,
        status: true,
      },
    });

    const subjects = subjectsByDivisionTeacher.map((s) => s.subject);

    return sendResponse(res, true, subjects, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllTeacherDivisions", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Students
export async function getAllStudents(req, res) {
  try {
    let { searchText, courseId, batchId, divisionId, currentPage, itemsPerPage } = req.query;

    const options = {};
    likeIfValue(options, ["firstName", "lastName", "rollNumber", "email"], searchText);
    whereIfValue(options, "courseId", courseId, getIntOrNull);
    whereIfValue(options, "batchId", batchId, getIntOrNull);
    whereIfValue(options, "divisionId", divisionId, getIntOrNull);

    const students = await prisma.student.findMany({
      ...options,
      ...getPrismaPagination(currentPage, itemsPerPage),
      include: {
        batch: {
          include: {
            course: true,
          },
        },
        division: true,
      },
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
      include: {
        uploadedStudentDocuments: {
          include: {
            document: true,
          },
          where: {
            status: true,
          },
        },
      },
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

// Assignments
export async function getAllAssignments(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;
    let { searchText, subjectId, divisionId, currentPage, itemsPerPage } = req.query;

    const options = {};
    likeIfValue(options, ["name"], searchText);
    whereIfValue(options, "subjectId", subjectId, getIntOrNull);
    whereIfValue(options, "divisionId", divisionId, getIntOrNull);

    const assignments = await prisma.assignment.findMany({
      ...options,
      ...getPrismaPagination(currentPage, itemsPerPage),
      include: {
        subject: true,
        division: {
          include: {
            batch: {
              include: {
                course: true,
              },
            },
          },
        },
      },
      where: {
        teacherId,
      },
    });

    const assignmentCount = await prisma.assignment.count(options);

    return sendResponse(res, true, { assignments, assignmentCount }, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllAssignments", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleAssignment(req, res) {
  try {
    const { id } = req.params;
    const { id: teacherId } = req.app.settings.userInfo;

    const assignment = await prisma.assignment.findUnique({
      include: {
        subject: true,
        division: true,
        material: {
          where: {
            status: true,
          },
        },
        questions: {
          where: {
            status: true,
          },
        },
      },
      where: {
        id: parseInt(id),
        teacherId,
      },
    });

    return sendResponse(res, true, assignment, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getAllAssignments", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveAssignment(req, res) {
  try {
    const { id, name, description, divisionId, subjectId, dueDate, questions, material } = req.body;
    const { id: teacherId } = req.app.settings.userInfo;

    const assignmentData = {
      name: getStringOrNull(name),
      description: getStringOrNull(description),
      divisionId: getIntOrNull(divisionId),
      subjectId: getIntOrNull(subjectId),
      teacherId,
      dueDate,
    };

    let currentAssigment;

    if (getIntOrNull(id)) {
      currentAssigment = await prisma.assignment.update({
        data: assignmentData,
        where: {
          id: parseInt(id),
        },
      });
    } else {
      currentAssigment = await prisma.assignment.create({
        data: assignmentData,
      });
    }

    await prisma.assignmentQuestion.updateMany({
      data: {
        status: false,
      },
      where: {
        assignmentId: currentAssigment.id,
      },
    });

    if (questions && questions.length) {
      for (let i = 0; i < questions.length; i++) {
        let questionObj = {
          question: questions[i].name,
          order: i,
          assignmentId: currentAssigment.id,
          status: true,
        };

        if (questions[i].db_id) {
          await prisma.assignmentQuestion.update({
            data: questionObj,
            where: {
              id: parseInt(questions[i].db_id),
            },
          });
        } else {
          await prisma.assignmentQuestion.create({
            data: questionObj,
          });
        }
      }
    }

    await prisma.assignmentMaterial.updateMany({
      data: {
        status: false,
      },
      where: {
        assignmentId: currentAssigment.id,
      },
    });

    if (material && material.length) {
      await prisma.assignmentMaterial.createMany({
        data: material.map((m) => ({
          material_url: m,
          assignmentId: currentAssigment.id,
        })),
      });
    }

    return sendResponse(res, true, null, "Teacher Saved.");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in saveTeacher", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getStudentsByAssignment(req, res) {
  try {
    let { searchText, currentPage, itemsPerPage } = req.query;
    const { assignmentId } = req.params;

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: parseInt(assignmentId),
      },
    });

    if (!assignment) return sendResponse(res, true, null, "Failed To Find Assignment");

    let options = {};

    likeIfValue(options, ["firstName", "lastName", "rollNumber", "email"], searchText);
    whereIfValue(options, "divisionId", assignment.divisionId, getIntOrNull);

    const students = await prisma.student.findMany({
      include: {
        submittedAssignments: {
          where: {
            assignmentId: assignment.id,
          },
        },
      },
      ...getPrismaPagination(currentPage, itemsPerPage),
      orderBy: {
        submittedAssignments: {
          _count: "desc",
        },
      },
      ...options,
    });

    const studentCount = await prisma.student.count(options);

    return sendResponse(res, true, { students, studentCount }, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllAssignments", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSubmittedAssignment(req, res) {
  try {
    const { submittedAssignmentId } = req.params;
    const { id: teacherId } = req.app.settings.userInfo;

    const checkAssignmentSubmitted = await prisma.assignmentsSubmitted.findUnique({
      where: {
        id: parseInt(submittedAssignmentId),
      },
    });

    if (!checkAssignmentSubmitted) {
      return sendResponse(res, false, null, "Assignment Does Not Exists.");
    }

    const submittedAssignment = await prisma.assignmentsSubmitted.findUnique({
      include: {
        assignment: {
          include: {
            assignmentUploads: {
              where: {
                studentId: checkAssignmentSubmitted.studentId,
              },
            },
            responses: {
              include: {
                assignmentQuestion: true,
              },
              where: {
                studentId: checkAssignmentSubmitted.studentId,
              },
            },
            subject: true,
          },
        },
        student: true,
      },
      where: {
        id: parseInt(submittedAssignmentId),
      },
    });

    return sendResponse(res, true, submittedAssignment, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllAssignments", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

// Events
export async function getAllEvents(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;
    let { searchText, currentPage, itemsPerPage, eventType, onlyRequested } = req.query;

    const options = {};
    likeIfValue(options, ["name"], searchText);

    let where = {};

    if (eventType === "organised") {
      where = {
        ...where,
        OR: [
          {
            eventHeadId: teacherId,
          },
          {
            eventOrganisers: {
              some: {
                teacherId,
                approvalStatus: "approved",
              },
            },
          },
        ],
      };
    }

    if (eventType === "participated") {
      where = {
        ...where,
        eventParticipants: {
          some: {
            teacherId,
          },
        },
      };
    }

    if (onlyRequested) {
      where = {
        ...where,
        eventHeadId: teacherId,
        approvalStatus: {
          not: "approved",
        },
      };
    }

    const events = await prisma.event.findMany({
      // ...options,
      ...getPrismaPagination(currentPage, itemsPerPage),
      include: {
        eventHead: true,
        eventOrganisers: true,
        eventParticipants: true,
      },
      where: {
        approvalStatus: "approved",
        ...options.where,
        ...where,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const eventCount = await prisma.event.count(options);

    return sendResponse(res, true, { events, eventCount }, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function getSingleEvent(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;

    let { eventId } = req.params;
    let { showMyEvents, showParticipatedInEvents } = req.query;

    let where = {};

    if (showMyEvents) {
      where = {
        eventHeadId: teacherId,
      };
    }

    if (showParticipatedInEvents) {
      where = {
        eventOrganisers: {
          some: {
            teacherId,
          },
        },
      };
    }

    const event = await prisma.event.findUnique({
      include: {
        eventOrganisers: {
          include: {
            teacher: true,
          },
        },
        eventParticipants: {
          include: {
            event: true,
            student: true,
            teacher: true,
          },
        },
        eventHead: true,
      },
      where: {
        id: parseInt(eventId),
        approvalStatus: "approved",
        ...where,
      },
    });

    return sendResponse(res, true, event, "Success");
  } catch (error) {
    logger.consoleErrorLog(req.originalUrl, "Error in getSingleEvent", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function saveEvent(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;
    const { name, description, datetime, eventId, venue, eventFor, batchId, courseId, finalRegistrationDate } = req.body;

    const eventData = {
      name,
      description,
      datetime,
      venue,
      eventFor,
      batchId,
      courseId,
      eventHeadId: teacherId,
      finalRegistrationDate,
      approvalStatus: "pending",
    };

    if (!eventId) {
      await prisma.event.create({
        data: eventData,
      });
    } else {
      const currentEvent = await prisma.event.findUnique({
        where: {
          eventHeadId: teacherId,
          id: parseInt(eventId),
        },
      });

      if (!currentEvent) return sendResponse(res, false, null, "You Do Not Have Access To Modify This Event");

      if (currentEvent.isCompleted) return sendResponse(res, false, null, "A Complete Event Can No Longer Be Modified");

      await prisma.event.update({
        data: eventData,
        where: {
          id: parseInt(eventId),
        },
      });
    }

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in saveEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function deleteEvent(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;
    const eventId = getIntOrNull(req.params.eventId);

    const allowDelete = await prisma.event.findUnique({
      where: {
        id: eventId,
        eventHeadId: teacherId,
      },
    });

    if (!allowDelete) {
      return sendResponse(res, false, null, "You Cannot Delete This Event");
    }

    await prisma.eventOrganiser.deleteMany({
      where: {
        eventId,
      },
    });

    await prisma.eventParticipant.deleteMany({
      where: {
        eventId,
      },
    });

    await prisma.event.deleteMany({
      where: {
        id: eventId,
      },
    });

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in deleteEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function joinEventOrganisers(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;
    const { eventId, message } = req.body;

    if (!eventId) {
      return sendResponse(res, false, null, "Send All Details");
    }

    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
        approvalStatus: "approved",
      },
    });

    if (!event) {
      return sendResponse(res, false, null, "No Such Event");
    }

    if (event.isCompleted) return sendResponse(res, false, null, "You Cannot Join A Complete Event");

    const isEventHead = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
        eventHeadId: teacherId,
      },
    });

    if (isEventHead) {
      return sendResponse(res, false, null, "You are already the head of this event.");
    }

    const existingOrganiser = await prisma.eventOrganiser.findFirst({
      where: {
        eventId: parseInt(eventId),
        teacherId,
      },
    });

    if (existingOrganiser) {
      return sendResponse(res, false, null, "You are already an organiser for this event.");
    }

    await prisma.eventOrganiser.create({
      data: {
        message,
        eventId: parseInt(eventId),
        teacherId,
      },
    });

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function joinEventParticipants(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;
    const { eventId } = req.body;

    if (!eventId) {
      return sendResponse(res, false, null, "Send All Details");
    }

    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
        approvalStatus: "approved",
      },
    });

    if (!event) {
      return sendResponse(res, false, null, "No Such Event");
    }

    if (event.isCompleted) return sendResponse(res, false, null, "You Cannot Join A Complete Event");

    const now = moment();
    if (event.finalRegistrationDate && now.isAfter(moment(event.finalRegistrationDate))) {
      return sendResponse(res, false, null, "Registration For this Event is Closed.");
    }

    const isEventHead = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
        eventHeadId: teacherId,
      },
    });

    if (isEventHead) {
      return sendResponse(res, false, null, "You are already the head of this event.");
    }

    const existingParticipant = await prisma.eventParticipant.findFirst({
      where: {
        eventId: parseInt(eventId),
        teacherId,
      },
    });

    if (existingParticipant) {
      return sendResponse(res, false, null, "You are already a participant for this event.");
    }

    await prisma.eventParticipant.create({
      data: {
        eventId: parseInt(eventId),
        teacherId,
      },
    });

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function setEventOrganiserApprovalStatus(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;
    const { eventId, teacherId: organiserId, approvalStatus } = req.body;

    if (!organiserId || !eventId || !approvalStatus) {
      return sendResponse(res, false, null, "Send All Details");
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        approvalStatus: "approved",
      },
    });

    if (!event) {
      return sendResponse(res, false, null, "No Such Event");
    }

    if (event.isCompleted) return sendResponse(res, false, null, "You Cannot Modify A Complete Event");

    if (event.eventHeadId !== teacherId) {
      return sendResponse(res, false, null, "You are not the head of this event.");
    }

    const userIsOrganiser = await prisma.eventOrganiser.findFirst({
      where: {
        eventId: parseInt(eventId),
        teacherId: parseInt(organiserId),
      },
    });

    if (!userIsOrganiser) {
      return sendResponse(res, false, null, "This user has not request to be an organiser.");
    }

    await prisma.eventOrganiser.updateMany({
      data: {
        approvalStatus,
      },
      where: {
        eventId: parseInt(eventId),
        teacherId: parseInt(organiserId),
      },
    });

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function deleteEventParticipants(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;
    const { eventParticipantId } = req.params;

    const existingParticipant = await prisma.eventParticipant.findFirst({
      include: {
        event: true,
      },
      where: {
        id: parseInt(eventParticipantId),
      },
    });

    if (!existingParticipant) {
      return sendResponse(res, false, null, "You are not a participant for this event.");
    }

    if (existingParticipant.event.isCompleted)
      return sendResponse(res, false, null, "You Cannot Modify A Complete Event");

    if (existingParticipant.event.eventHeadId !== teacherId && existingParticipant.teacherId !== teacherId) {
      return sendResponse(res, false, null, "You Do Not Have Access To Remove Someone Else From this Event");
    }

    await prisma.eventParticipant.delete({
      where: {
        id: existingParticipant.id,
      },
    });

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}

export async function markEventComplete(req, res) {
  try {
    const { id: teacherId } = req.app.settings.userInfo;
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
    });

    if (!event) {
      return sendResponse(res, false, null, "No Such Event");
    }

    if (event.eventHeadId !== teacherId) {
      return sendResponse(res, false, null, "You are not the head of this event.");
    }

    await prisma.event.update({
      data: {
        isCompleted: true,
      },
      where: {
        id: parseInt(eventId),
      },
    });

    return sendResponse(res, true, null, "Success");
  } catch (error) {
    console.log({ error });
    logger.consoleErrorLog(req.originalUrl, "Error in getAllEvents", error);
    return sendResponse(res, false, null, "Error", statusType.DB_ERROR);
  }
}
