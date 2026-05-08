-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CounterStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('WAITING', 'CALLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" "QueueStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "counterNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "status" "CounterStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentTokenId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "tokenNumber" INTEGER NOT NULL,
    "serviceDate" DATE NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT 'WAITING',
    "assignedCounterId" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "calledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sequence" (
    "id" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "serviceDate" DATE NOT NULL,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounterQueueAssignment" (
    "counterId" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,

    CONSTRAINT "CounterQueueAssignment_pkey" PRIMARY KEY ("counterId","queueId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_name_key" ON "Queue"("name");

-- CreateIndex
CREATE INDEX "Queue_status_createdAt_idx" ON "Queue"("status", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Counter_counterNumber_key" ON "Counter"("counterNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Counter_currentTokenId_key" ON "Counter"("currentTokenId");

-- CreateIndex
CREATE INDEX "Counter_status_idx" ON "Counter"("status");

-- CreateIndex
CREATE INDEX "Token_queueId_serviceDate_status_tokenNumber_idx" ON "Token"("queueId", "serviceDate", "status", "tokenNumber");

-- CreateIndex
CREATE INDEX "Token_status_assignedCounterId_calledAt_idx" ON "Token"("status", "assignedCounterId", "calledAt");

-- CreateIndex
CREATE INDEX "Token_queueId_serviceDate_status_calledAt_idx" ON "Token"("queueId", "serviceDate", "status", "calledAt");

-- CreateIndex
CREATE INDEX "Token_queueId_serviceDate_status_createdAt_idx" ON "Token"("queueId", "serviceDate", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Token_serviceDate_status_queueId_idx" ON "Token"("serviceDate", "status", "queueId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_queueId_serviceDate_tokenNumber_key" ON "Token"("queueId", "serviceDate", "tokenNumber");

-- CreateIndex
CREATE INDEX "Sequence_queueId_idx" ON "Sequence"("queueId");

-- CreateIndex
CREATE INDEX "Sequence_serviceDate_idx" ON "Sequence"("serviceDate");

-- CreateIndex
CREATE UNIQUE INDEX "Sequence_queueId_serviceDate_key" ON "Sequence"("queueId", "serviceDate");

-- CreateIndex
CREATE INDEX "CounterQueueAssignment_queueId_idx" ON "CounterQueueAssignment"("queueId");

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_currentTokenId_fkey" FOREIGN KEY ("currentTokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_assignedCounterId_fkey" FOREIGN KEY ("assignedCounterId") REFERENCES "Counter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sequence" ADD CONSTRAINT "Sequence_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterQueueAssignment" ADD CONSTRAINT "CounterQueueAssignment_counterId_fkey" FOREIGN KEY ("counterId") REFERENCES "Counter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterQueueAssignment" ADD CONSTRAINT "CounterQueueAssignment_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
