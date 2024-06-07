-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "location" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersCard" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT,
    "town" TEXT NOT NULL,
    "goalId" INTEGER NOT NULL,

    CONSTRAINT "UsersCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetGoal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "MeetGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMessages" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "sendedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "messageReplyId" INTEGER,

    CONSTRAINT "UserMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsersCard" ADD CONSTRAINT "UsersCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersCard" ADD CONSTRAINT "UsersCard_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "MeetGoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessages" ADD CONSTRAINT "UserMessages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
