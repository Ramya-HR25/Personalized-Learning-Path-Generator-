import { Router } from "express";
import {
  createTopicResource,
  deleteCatalogTopic,
  deleteFeedback,
  deleteTopicResource,
  getAdminOverview,
  ingestResourceQuizContent,
  upsertCatalogTopic
} from "../controllers/adminController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireAdmin);
router.get("/overview", getAdminOverview);
router.post("/catalog/topic", upsertCatalogTopic);
router.delete("/catalog/topic", deleteCatalogTopic);
router.post("/catalog/resource", createTopicResource);
router.post("/catalog/resource/ingest", ingestResourceQuizContent);
router.delete("/catalog/resource", deleteTopicResource);
router.delete("/feedback/:feedbackId", deleteFeedback);

export default router;
