-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `eyebrow` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `colorPrimary` VARCHAR(191) NOT NULL,
    `colorSecondary` VARCHAR(191) NOT NULL,
    `colorAccent` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Categoria_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dulce` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `popularidad` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `ingredientes` TEXT NOT NULL,
    `geometria3d` VARCHAR(191) NULL,
    `esEmblematico` BOOLEAN NOT NULL DEFAULT false,
    `categoriaId` INTEGER NOT NULL,

    UNIQUE INDEX `Dulce_popularidad_key`(`popularidad`),
    INDEX `Dulce_categoriaId_idx`(`categoriaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dulce` ADD CONSTRAINT `Dulce_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
