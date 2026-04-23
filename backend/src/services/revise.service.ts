/**
 * Revise Service — fetches spaced-repetition revision solves
 * Updated for new schema: Solve → Problem (with title, url, platform)
 */
import { prisma } from "../prismac";

const IST_OFFSET_MS = 0;

function getISTDayRangeUTCFromISTDate(istDate: Date) {
  // Start of that day in IST
  const startIST = new Date(istDate);
  startIST.setHours(0, 0, 0, 0);

  // Convert IST start → UTC
  const startUTC = new Date(startIST.getTime() - IST_OFFSET_MS);

  // End = +1 day (still in UTC)
  const endUTC = new Date(startUTC);
  endUTC.setUTCDate(endUTC.getUTCDate() + 1);

  return { startUTC, endUTC };
}

export const getRevisionSolves = async (userId: string) => {
  // 1️⃣ Compute now in IST
  const nowUTC = new Date();
  const nowIST = new Date(nowUTC.getTime() + IST_OFFSET_MS);

  // 2️⃣ Target days in IST
  const yesterdayIST = new Date(nowIST);
  yesterdayIST.setDate(yesterdayIST.getDate() - 1);

  const weekBackIST = new Date(nowIST);
  weekBackIST.setDate(weekBackIST.getDate() - 7);

  const monthBackIST = new Date(nowIST);
  monthBackIST.setDate(monthBackIST.getDate() - 30);

  // 3️⃣ Convert IST days → UTC ranges
  const { startUTC: yStart, endUTC: yEnd } =
    getISTDayRangeUTCFromISTDate(yesterdayIST);

  const { startUTC: wStart, endUTC: wEnd } =
    getISTDayRangeUTCFromISTDate(weekBackIST);

  const { startUTC: mStart, endUTC: mEnd } =
    getISTDayRangeUTCFromISTDate(monthBackIST);

  // Include problem details (title, url, externalId) with each solve
  const solveInclude = {
    problem: {
      select: {
        id: true,
        title: true,
        url: true,
        externalId: true,
        difficulty: true,
        platform: { select: { name: true } },
      },
    },
  };

  const [previousDay, previousWeek, previousMonth] = await Promise.all([
    prisma.solve.findMany({
      where: { userId, solvedAt: { gte: yStart, lt: yEnd } },
      orderBy: { solvedAt: "asc" },
      include: solveInclude,
    }),
    prisma.solve.findMany({
      where: { userId, solvedAt: { gte: wStart, lt: wEnd } },
      orderBy: { solvedAt: "asc" },
      include: solveInclude,
    }),
    prisma.solve.findMany({
      where: { userId, solvedAt: { gte: mStart, lt: mEnd } },
      orderBy: { solvedAt: "asc" },
      include: solveInclude,
    }),
  ]);

  return {
    previousDay,
    previousWeek,
    previousMonth
  };
};
