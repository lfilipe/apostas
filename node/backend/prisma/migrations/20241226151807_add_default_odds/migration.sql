-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_betting_odds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matchId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "matchDateTime" DATETIME NOT NULL,
    "homeWinOdd" REAL NOT NULL DEFAULT 2.00,
    "awayWinOdd" REAL NOT NULL DEFAULT 1.50,
    "drawOdd" REAL NOT NULL DEFAULT 2.00,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "betting_odds_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_betting_odds" ("awayWinOdd", "createdAt", "createdBy", "drawOdd", "homeWinOdd", "id", "matchDateTime", "matchId", "seasonId", "updatedAt", "updatedBy") SELECT "awayWinOdd", "createdAt", "createdBy", "drawOdd", "homeWinOdd", "id", "matchDateTime", "matchId", "seasonId", "updatedAt", "updatedBy" FROM "betting_odds";
DROP TABLE "betting_odds";
ALTER TABLE "new_betting_odds" RENAME TO "betting_odds";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
