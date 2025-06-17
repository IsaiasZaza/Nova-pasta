/*
  Warnings:

  - You are about to drop the column `cep` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `complement` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_cpf_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cep",
DROP COLUMN "complement",
DROP COLUMN "cpf",
DROP COLUMN "number",
DROP COLUMN "street",
ADD COLUMN     "nascimento" TEXT;
