-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL,
    "companyName" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
