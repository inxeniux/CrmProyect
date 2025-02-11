/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `username` ON `User`;

-- AlterTable
ALTER TABLE `Client` ADD COLUMN `comments` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `username`,
    MODIFY `businessId` INTEGER NULL,
    MODIFY `status` ENUM('Active', 'Inactive', 'Suspended', 'PENDING_BUSINESS', 'PENDING_VERIFICATION') NULL DEFAULT 'Active';

-- CreateTable
CREATE TABLE `ScheduledEmail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `scheduledTime` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduledEmailRecipient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `scheduledEmailId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailTemplate` (
    `template_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `businessId` INTEGER NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ScheduledEmailRecipient` ADD CONSTRAINT `ScheduledEmailRecipient_scheduledEmailId_fkey` FOREIGN KEY (`scheduledEmailId`) REFERENCES `ScheduledEmail`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
