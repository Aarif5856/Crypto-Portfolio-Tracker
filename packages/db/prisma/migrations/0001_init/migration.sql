-- Initial schema for Crypto Portfolio Tracker

CREATE TABLE "User" (
  "id" SERIAL NOT NULL,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Account" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Account_externalId_key" ON "Account"("externalId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

CREATE TABLE "Asset" (
  "id" SERIAL NOT NULL,
  "symbol" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Asset_symbol_key" ON "Asset"("symbol");

CREATE TABLE "Holding" (
  "id" SERIAL NOT NULL,
  "accountId" INTEGER NOT NULL,
  "assetId" INTEGER NOT NULL,
  "quantity" DECIMAL(38,18) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Holding_accountId_idx" ON "Holding"("accountId");
CREATE INDEX "Holding_assetId_idx" ON "Holding"("assetId");

ALTER TABLE "Account"
  ADD CONSTRAINT "Account_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Holding"
  ADD CONSTRAINT "Holding_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "Account"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Holding"
  ADD CONSTRAINT "Holding_assetId_fkey"
  FOREIGN KEY ("assetId") REFERENCES "Asset"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

