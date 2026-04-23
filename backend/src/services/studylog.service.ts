/**
 * StudyLog Service — computes stats from solve data
 * Since StudyLog model was removed, we derive stats purely from Solve records
 */
import { prisma } from "../prismac";

/** Get a stats summary: total solves, today's solves, current streak */
export async function getStatsSummary(userId: string) {
  // Total problems solved (all time)
  const totalSolves = await prisma.solve.count({ where: { userId } });

  // Today's solves count (as proxy for activity)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaySolves = await prisma.solve.count({
    where: {
      userId,
      solvedAt: { gte: today, lt: tomorrow },
    },
  });

  // Compute streak: consecutive days with at least 1 solve
  const streak = await computeStreak(userId);

  return { totalSolves, todayHours: todaySolves, streak };
}

/** Compute how many consecutive days the user has solved at least 1 problem */
async function computeStreak(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  // Check up to 365 days back
  for (let i = 0; i < 365; i++) {
    const dayStart = new Date(checkDate);
    const dayEnd = new Date(checkDate);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const count = await prisma.solve.count({
      where: {
        userId,
        solvedAt: { gte: dayStart, lt: dayEnd },
      },
    });

    if (count > 0) {
      streak++;
    } else if (i === 0) {
      // If no solves today, that's ok — check from yesterday
    } else {
      break;
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}
