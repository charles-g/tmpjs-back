-- CreateTable
CREATE TABLE "Worker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkerAddress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worker_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "coordinates_lat" TEXT NOT NULL,
    "coordinates_lon" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "WorkerAddress_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkerAvailability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worker_id" INTEGER NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "WorkerAvailability_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompanyAvailableContractTimeSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "CompanyAvailableContractTimeSlot_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompanyAddress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "coordinates_lat" TEXT NOT NULL,
    "coordinates_lon" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "CompanyAddress_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkerSkill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worker_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "WorkerSkill_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkerSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompanySkill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "CompanySkill_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompanySkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostContractFeedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "worker_feedback_positive" BOOLEAN NOT NULL,
    "company_feedback_positive" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "PostContractFeedback_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PostContractFeedback_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApplicationStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkerApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "WorkerApplication_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkerApplication_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkerApplication_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "ApplicationStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerAddress_worker_id_key" ON "WorkerAddress"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyAvailableContractTimeSlot_company_id_key" ON "CompanyAvailableContractTimeSlot"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyAddress_company_id_key" ON "CompanyAddress"("company_id");
