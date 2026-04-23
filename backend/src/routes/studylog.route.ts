/**
 * StudyLog Routes — stats endpoint
 * Simplified: no study hours logging since StudyLog model was removed
 */
import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { statsSummaryController } from "../controllers/studylog.controller";

const router = Router();

// Stats summary requires authentication
router.get("/stats/summary", checkAuth, statsSummaryController);

export default router;
