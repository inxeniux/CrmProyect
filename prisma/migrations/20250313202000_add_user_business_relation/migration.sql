/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EmailTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduledEmail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduledEmailRecipient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ScheduledEmailRecipient` DROP FOREIGN KEY `ScheduledEmailRecipient_scheduledEmailId_fkey`;

-- AlterTable
ALTER TABLE `Business` ADD COLUMN `color1` VARCHAR(100) NULL,
    ADD COLUMN `color2` VARCHAR(100) NULL,
    ADD COLUMN `color3` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `role`,
    ADD COLUMN `roleId` INTEGER NULL,
    MODIFY `status` ENUM('Active', 'Inactive', 'Suspended', 'PENDING_VERIFICATION', 'PENDING_BUSINESS') NULL DEFAULT 'Active';

-- DropTable
DROP TABLE `EmailTemplate`;

-- DropTable
DROP TABLE `ScheduledEmail`;

-- DropTable
DROP TABLE `ScheduledEmailRecipient`;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `Permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoleToPermission` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RoleToPermission_AB_unique`(`A`, `B`),
    INDEX `_RoleToPermission_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToPermission` ADD CONSTRAINT `_RoleToPermission_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToPermission` ADD CONSTRAINT `_RoleToPermission_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `email` TO `User_email_key`;
