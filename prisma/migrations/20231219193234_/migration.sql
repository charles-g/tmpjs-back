-- CreateTable
CREATE TABLE "Worker" (
    "id_worker" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id_worker")
);

-- CreateTable
CREATE TABLE "WorkerAddress" (
    "id_worker_address" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "coordinates_lat" DOUBLE PRECISION NOT NULL,
    "coordinates_lon" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "WorkerAddress_pkey" PRIMARY KEY ("id_worker_address")
);

-- CreateTable
CREATE TABLE "Company" (
    "id_company" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id_company")
);

-- CreateTable
CREATE TABLE "WorkerAvailability" (
    "id_worker_availability" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "day_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "WorkerAvailability_pkey" PRIMARY KEY ("id_worker_availability")
);

-- CreateTable
CREATE TABLE "CompanyAvailableContractTimeSlot" (
    "id_company_available_contract_time_slot" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "day_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "CompanyAvailableContractTimeSlot_pkey" PRIMARY KEY ("id_company_available_contract_time_slot")
);

-- CreateTable
CREATE TABLE "CompanyAddress" (
    "id_company_address" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "coordinates_lat" DOUBLE PRECISION NOT NULL,
    "coordinates_lon" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "CompanyAddress_pkey" PRIMARY KEY ("id_company_address")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id_skill" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id_skill")
);

-- CreateTable
CREATE TABLE "WorkerSkill" (
    "id_worker_skill" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "WorkerSkill_pkey" PRIMARY KEY ("id_worker_skill")
);

-- CreateTable
CREATE TABLE "CompanySkill" (
    "id_company_skill" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "CompanySkill_pkey" PRIMARY KEY ("id_company_skill")
);

-- CreateTable
CREATE TABLE "PostContractFeedback" (
    "id_post_contract_feedback" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "worker_feedback_positive" BOOLEAN NOT NULL,
    "company_feedback_positive" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "PostContractFeedback_pkey" PRIMARY KEY ("id_post_contract_feedback")
);

-- CreateTable
CREATE TABLE "ApplicationStatus" (
    "id_application_status" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ApplicationStatus_pkey" PRIMARY KEY ("id_application_status")
);

-- CreateTable
CREATE TABLE "WorkerApplication" (
    "id_worker_application" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "WorkerApplication_pkey" PRIMARY KEY ("id_worker_application")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerAddress_worker_id_key" ON "WorkerAddress"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyAddress_company_id_key" ON "CompanyAddress"("company_id");

-- AddForeignKey
ALTER TABLE "WorkerAddress" ADD CONSTRAINT "WorkerAddress_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id_worker") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerAvailability" ADD CONSTRAINT "WorkerAvailability_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id_worker") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyAvailableContractTimeSlot" ADD CONSTRAINT "CompanyAvailableContractTimeSlot_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id_company") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyAddress" ADD CONSTRAINT "CompanyAddress_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id_company") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerSkill" ADD CONSTRAINT "WorkerSkill_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id_worker") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerSkill" ADD CONSTRAINT "WorkerSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id_skill") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanySkill" ADD CONSTRAINT "CompanySkill_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id_company") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanySkill" ADD CONSTRAINT "CompanySkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("id_skill") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostContractFeedback" ADD CONSTRAINT "PostContractFeedback_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id_company") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostContractFeedback" ADD CONSTRAINT "PostContractFeedback_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id_worker") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerApplication" ADD CONSTRAINT "WorkerApplication_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id_company") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerApplication" ADD CONSTRAINT "WorkerApplication_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id_worker") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerApplication" ADD CONSTRAINT "WorkerApplication_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "ApplicationStatus"("id_application_status") ON DELETE RESTRICT ON UPDATE CASCADE;
