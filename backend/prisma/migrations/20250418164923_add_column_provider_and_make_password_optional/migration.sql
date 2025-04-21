-- AlterTable
ALTER TABLE `user` ADD COLUMN `provider` ENUM('local', 'google', 'github') NOT NULL DEFAULT 'local',
    MODIFY `password` VARCHAR(255) NULL;
