import { Router } from "express";
import {
  getCurrentPath,
  getDashboard,
  getOptions,
  savePreferences,
  submitChapterQuiz,
  trackResource,
  getResourceQuiz,
  getAllPaths,
  switchPath,
  searchCourses
} from "../controllers/learningController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/options", getOptions);
router.get("/search", searchCourses);
router.post("/preferences", requireAuth, savePreferences);
router.get("/path", requireAuth, getCurrentPath);
router.get("/paths", requireAuth, getAllPaths); // Get all paths
router.post("/path/switch", requireAuth, switchPath); // Switch active path
router.post("/track", requireAuth, trackResource);
router.post("/quiz", requireAuth, submitChapterQuiz);
router.post("/resource-quiz", requireAuth, getResourceQuiz);
router.get("/dashboard", requireAuth, getDashboard);

export default router;
