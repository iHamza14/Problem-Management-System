/**
 * Sync Solves Job — wrapper to fire-and-forget CF solve sync
 * Updated: now passes platformId as required by the new schema
 */
import { prisma } from "../prismac";
import { syncLast30DaysSolves } from "../services/cfSolveSync.service";

export async function syncUserSolves(
  userId: string,
  handle: string
) {
  try {
    // Find/create the codeforces platform
    const platform = await prisma.platform.upsert({
      where: { name: "codeforces" },
      create: { name: "codeforces", url: "https://codeforces.com" },
      update: {},
    });

    await syncLast30DaysSolves(userId, handle, platform.id);
  } catch (err) {
    console.error(
      `CF solve sync failed for user ${handle}:`,
      err
    );
  }
}
