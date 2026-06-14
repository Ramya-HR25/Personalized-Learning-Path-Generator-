import { Router } from "express";
import { getMyFeedback, submitFeedback } from "../controllers/feedbackController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", getMyFeedback);
router.post("/", submitFeedback);

export default router;
