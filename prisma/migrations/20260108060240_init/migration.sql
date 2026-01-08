-- CreateTable
CREATE TABLE "Feed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "itemSelector" TEXT NOT NULL DEFAULT 'article',
    "titleSelector" TEXT NOT NULL DEFAULT 'h2',
    "linkSelector" TEXT NOT NULL DEFAULT 'a',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
