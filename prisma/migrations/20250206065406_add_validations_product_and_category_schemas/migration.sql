/*
  Warnings:

  - You are about to alter the column `name` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `slug` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `slug` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "price" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
