/**
 * Refresh Controller — re-syncs user's CF data
 * Updated for new schema: reads handle from UserPlatformHandle
 */
import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { prisma } from "../prismac";
import { CodeforcesUser, CodeforcesResponse } from "../types/codeforces";
import { syncLast30DaysSolves } from "../services/cfSolveSync.service";

export const refreshController = async (req: AuthedRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user || !user.handle) {
      return res.status(400).json({ error: "Handle not set" });
    }

    // Fetch CF info
    const cfRes = await fetch(
      `https://codeforces.com/api/user.info?handles=${user.handle}`
    );

    const cfData = (await cfRes.json()) as CodeforcesResponse<CodeforcesUser>;

    if (cfData.status !== "OK") {
      return res.status(400).json({ error: "Failed to fetch CF data" });
    }

    const cfUser = cfData.result[0];

    // Find the codeforces platform ID
    const platform = await prisma.platform.findUnique({
      where: { name: "codeforces" },
    });

    if (platform) {
      await syncLast30DaysSolves(user.userId, user.handle, platform.id);
    }

    console.log("synced");
    return res.json({
      success: true,
      rating: cfUser.rating ?? null,
      handle: cfUser.handle,
    });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
