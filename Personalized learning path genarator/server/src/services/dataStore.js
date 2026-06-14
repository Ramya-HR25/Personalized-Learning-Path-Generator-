import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { adminSeed, learningCatalog } from "../seed/catalog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../../data");
const dbFile = path.join(dataDir, "runtime-db.json");

const initialState = {
  users: [],
  feedback: [],
  notifications: [],
  learningCatalog
};

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbFile)) {
    const state = structuredClone(initialState);
    state.users.push({
      id: "user-admin",
      ...adminSeed,
      preferences: null,
      path: null,
      activity: [],
      createdAt: new Date().toISOString()
    });
    fs.writeFileSync(dbFile, JSON.stringify(state, null, 2));
  }
}

export function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
}

export function writeDb(nextState) {
  ensureDb();
  fs.writeFileSync(dbFile, JSON.stringify(nextState, null, 2));
}

export function updateDb(updater) {
  const current = readDb();
  const next = updater(current);
  writeDb(next);
  return next;
}
