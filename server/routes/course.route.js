import express from "express";
import isAuthenticated from "../middelwares/isAuthenticated.middleware.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreaterCourses,
  getLectureById,
  removeLecture,
  togglePublishCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getCreaterCourses);
router
  .route("/:courseId")
  .put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated,editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById);
router.route("/:courseId").patch(isAuthenticated,togglePublishCourse);

export default router;
