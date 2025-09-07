-- CreateTable
CREATE TABLE `WeeklyReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `weekNumber` INTEGER NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `hours` INTEGER NOT NULL,
    `activities` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `learnings` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
