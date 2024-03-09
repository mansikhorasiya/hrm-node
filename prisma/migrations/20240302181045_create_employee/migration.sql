-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "EmployeeName" TEXT NOT NULL,
    "EmployeeStatus" TEXT NOT NULL,
    "JoiningDate" TEXT NOT NULL,
    "BirthDate" TEXT NOT NULL,
    "Skills" TEXT NOT NULL,
    "SalaryDetails" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);
