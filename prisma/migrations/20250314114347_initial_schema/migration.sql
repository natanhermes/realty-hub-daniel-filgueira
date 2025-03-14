-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "salePrice" DOUBLE PRECISION,
    "rentalPrice" DOUBLE PRECISION,
    "dailyPrice" DOUBLE PRECISION,
    "condominiumFee" DOUBLE PRECISION,
    "iptuValue" DOUBLE PRECISION,
    "acceptsFinancing" BOOLEAN,
    "acceptsExchange" BOOLEAN,
    "totalArea" DOUBLE PRECISION,
    "builtArea" DOUBLE PRECISION,
    "numberOfBedrooms" INTEGER,
    "numberOfSuites" INTEGER,
    "numberOfBathrooms" INTEGER,
    "numberOfParkingSpots" INTEGER,
    "constructionYear" INTEGER,
    "floor" INTEGER,
    "neighborhood" TEXT,
    "location" TEXT,
    "description" TEXT,
    "active" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infrastructure" (
    "id" TEXT NOT NULL,
    "hasBarbecue" BOOLEAN NOT NULL,
    "hasPool" BOOLEAN NOT NULL,
    "hasPartyRoom" BOOLEAN NOT NULL,
    "has24hPorter" BOOLEAN NOT NULL,
    "hasGourmetArea" BOOLEAN NOT NULL,
    "hasPlayground" BOOLEAN NOT NULL,
    "hasGym" BOOLEAN NOT NULL,
    "hasGarden" BOOLEAN NOT NULL,
    "hasCourt" BOOLEAN NOT NULL,
    "hasAirConditioning" BOOLEAN NOT NULL,
    "hasCustomFurniture" BOOLEAN NOT NULL,
    "hasBalcony" BOOLEAN NOT NULL,
    "hasOffice" BOOLEAN NOT NULL,
    "hasSolarEnergy" BOOLEAN NOT NULL,
    "hasElevator" BOOLEAN NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "infrastructure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "property_code_key" ON "property"("code");

-- CreateIndex
CREATE UNIQUE INDEX "infrastructure_propertyId_key" ON "infrastructure"("propertyId");

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infrastructure" ADD CONSTRAINT "infrastructure_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
