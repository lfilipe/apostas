-- CreateTable
CREATE TABLE "betting_odds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "matchDateTime" DATETIME NOT NULL,
    "homeWinOdd" REAL NOT NULL,
    "awayWinOdd" REAL NOT NULL,
    "drawOdd" REAL NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "betting_odds_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
