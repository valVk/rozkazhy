import { Capacitor } from "@capacitor/core";
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { DB_NAME, DB_VERSION, UPGRADE_STATEMENTS } from "../db/schema";

const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

let dbInstance: SQLiteDBConnection | null = null;
let initPromise: Promise<SQLiteDBConnection> | null = null;

async function initWebStore(): Promise<void> {
  if (Capacitor.getPlatform() !== "web") return;
  await import("jeep-sqlite/dist/components/jeep-sqlite");
  const jeepEl = document.createElement("jeep-sqlite");
  document.body.appendChild(jeepEl);
  await customElements.whenDefined("jeep-sqlite");
  await sqliteConnection.initWebStore();
}

async function openDatabase(): Promise<SQLiteDBConnection> {
  await initWebStore();

  await sqliteConnection.addUpgradeStatement(DB_NAME, UPGRADE_STATEMENTS);

  const isConn = (await sqliteConnection.isConnection(DB_NAME, false)).result;
  const db = isConn
    ? await sqliteConnection.retrieveConnection(DB_NAME, false)
    : await sqliteConnection.createConnection(
        DB_NAME,
        false,
        "no-encryption",
        DB_VERSION,
        false,
      );

  await db.open();
  return db;
}

export function useSqlite() {
  async function getDb(): Promise<SQLiteDBConnection> {
    if (dbInstance) return dbInstance;
    if (!initPromise) {
      initPromise = openDatabase().then((db) => {
        dbInstance = db;
        return db;
      });
    }
    return initPromise;
  }

  return { getDb };
}
