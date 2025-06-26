-- CreateTable
CREATE TABLE "Captain" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "scannerId" TEXT NOT NULL,
    "createDate" TIMESTAMP(3),
    "scriptName" TEXT NOT NULL,
    "scriptLink" TEXT NOT NULL,

    CONSTRAINT "Captain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Captain_userId_key" ON "Captain"("userId");
