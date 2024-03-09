/*
  Warnings:

  - Changed the type of `SalaryDetails` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "SalaryDetails",
ADD COLUMN     "SalaryDetails" INTEGER NOT NULL;
