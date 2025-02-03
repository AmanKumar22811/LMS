import express from "express";
import isAuthenticated from "../middelwares/isAuthenticated.middleware.js";
import {
  createCourse,
  editCourse,
  getCreaterCourses,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getCreaterCourses);
router
  .route("/:courseId")
  .put(isAuthenticated, upload.single("courseThumbnail"), editCourse);

export default router;
