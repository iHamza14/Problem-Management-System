/*
  Warnings:

  - You are about to drop the column `contestId` on the `Solve` table. All the data in the column will be lost.
  - You are about to drop the column `index` on the `Solve` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Solve` table. All the data in the column will be lost.
  - You are about to drop the column `problemName` on the `Solve` table. All the data in the column will be lost.
  - You are about to drop the column `handle` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `StudyLog` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,problemId]` on the table `Solve` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `problemId` to the `Solve` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudyLog" DROP CONSTRAINT "StudyLog_userId_fkey";

-- DropIndex
DROP INDEX "Solve_userId_contestId_index_key";

-- DropIndex
DROP INDEX "User_handle_key";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "problemId" TEXT;

-- AlterTable
ALTER TABLE "Solve" DROP COLUMN "contestId",
DROP COLUMN "index",
DROP COLUMN "link",
DROP COLUMN "problemName",
ADD COLUMN     "problemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "handle",
DROP COLUMN "rating";

-- DropTable
DROP TABLE "StudyLog";

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPlatformHandle" (
    "userId" TEXT NOT NULL,
    "platformId" INTEGER NOT NULL,
    "handle" TEXT NOT NULL,

    CONSTRAINT "UserPlatformHandle_pkey" PRIMARY KEY ("userId","platformId")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "platformId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" INTEGER NOT NULL,
    "platformId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id","platformId")
);

-- CreateTable
CREATE TABLE "ContestProblem" (
    "contestId" INTEGER NOT NULL,
    "platformId" INTEGER NOT NULL,
    "problemId" TEXT NOT NULL,
    "index" TEXT NOT NULL,

    CONSTRAINT "ContestProblem_pkey" PRIMARY KEY ("contestId","problemId")
);

-- CreateTable
CREATE TABLE "ProblemTag" (
    "problemId" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "ProblemTag_pkey" PRIMARY KEY ("problemId","tagId")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "runtime" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserPlatformHandle_platformId_handle_key" ON "UserPlatformHandle"("platformId", "handle");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_platformId_externalId_key" ON "Problem"("platformId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Solve_userId_problemId_key" ON "Solve"("userId", "problemId");

-- AddForeignKey
ALTER TABLE "UserPlatformHandle" ADD CONSTRAINT "UserPlatformHandle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlatformHandle" ADD CONSTRAINT "UserPlatformHandle_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_contestId_platformId_fkey" FOREIGN KEY ("contestId", "platformId") REFERENCES "Contest"("id", "platformId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemTag" ADD CONSTRAINT "ProblemTag_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemTag" ADD CONSTRAINT "ProblemTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solve" ADD CONSTRAINT "Solve_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
