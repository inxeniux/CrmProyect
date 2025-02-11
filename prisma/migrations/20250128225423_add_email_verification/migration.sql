-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `firstName` VARCHAR(50) NULL,
    `lastName` VARCHAR(50) NULL,
    `phoneNumber` VARCHAR(20) NULL,
    `role` ENUM('Admin', 'Manager', 'Sales', 'Support', 'Customer') NOT NULL,
    `businessId` INTEGER NOT NULL,
    `status` ENUM('Active', 'Inactive', 'Suspended') NULL DEFAULT 'Active',
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    INDEX `businessId`(`businessId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activities` (
    `activity_id` INTEGER NOT NULL AUTO_INCREMENT,
    `prospect_id` INTEGER NULL,
    `activity_type` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `activity_date` DATETIME(0) NULL,
    `created_by` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_prospect_id`(`prospect_id`),
    PRIMARY KEY (`activity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Business` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL,
    `phoneNumber` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `website` VARCHAR(255) NULL,
    `industry` VARCHAR(50) NULL,
    `logo` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `client_id` INTEGER NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(255) NULL,
    `contact_name` VARCHAR(255) NULL,
    `position` VARCHAR(100) NULL,
    `phone_number` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `website` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `state` VARCHAR(100) NULL,
    `postal_code` VARCHAR(20) NULL,
    `country` VARCHAR(100) NULL,
    `lead_source` VARCHAR(100) NULL,
    `industry` VARCHAR(100) NULL,
    `status` VARCHAR(50) NULL DEFAULT 'Prospect',
    `priority` ENUM('Low', 'Medium', 'High') NULL DEFAULT 'Medium',
    `assigned_to` VARCHAR(100) NULL,
    `tags` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funnel` (
    `funnel_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`funnel_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FunnelStage` (
    `stage_id` INTEGER NOT NULL AUTO_INCREMENT,
    `funnel_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `position` INTEGER NOT NULL,

    PRIMARY KEY (`stage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prospect` (
    `prospect_id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NULL,
    `funnel_id` INTEGER NULL,
    `stage` VARCHAR(100) NULL,
    `deal_value` DECIMAL(10, 2) NULL,
    `deal_closing_date` DATE NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `client_id`(`client_id`),
    INDEX `funnel_id`(`funnel_id`),
    PRIMARY KEY (`prospect_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `task_id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NULL,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `due_date` DATE NULL,
    `status` ENUM('Pending', 'In Progress', 'Completed') NULL DEFAULT 'Pending',
    `priority` ENUM('Low', 'Medium', 'High') NULL DEFAULT 'Medium',
    `assigned_to` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `client_id`(`client_id`),
    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_verifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verifiedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `email_verifications_email_idx`(`email`),
    INDEX `email_verifications_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`businessId`) REFERENCES `Business`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `FunnelStage` ADD CONSTRAINT `FunnelStage_funnel_id_fkey` FOREIGN KEY (`funnel_id`) REFERENCES `Funnel`(`funnel_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prospect` ADD CONSTRAINT `prospects_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Client`(`client_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Prospect` ADD CONSTRAINT `prospects_ibfk_2` FOREIGN KEY (`funnel_id`) REFERENCES `Funnel`(`funnel_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Client`(`client_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
