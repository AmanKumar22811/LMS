import express from "express";
import isAuthenticated from "../middelwares/isAuthenticated.middleware.js";
import {
  createCourse,
  getCreaterCourses,
} from "../controllers/course.controller.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getCreaterCourses);

export default router;
