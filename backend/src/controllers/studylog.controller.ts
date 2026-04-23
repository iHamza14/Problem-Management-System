/**
 * StudyLog Controller — handles stats requests
 * Simplified: no more study hours logging since StudyLog model removed
 */
import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { getStatsSummary } from "../services/studylog.service";

/** GET /stats/summary — total solves, today's solves, streak */
export const statsSummaryController = async (req: AuthedRequest, res: Response) => {
  try {
    const stats = await getStatsSummary(req.user!.userId);
    return res.json(stats);
  } catch (err) {
    console.error("Stats summary error:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
};
