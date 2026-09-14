import { Injectable } from "@nestjs/common";
import type { OnModuleInit, OnApplicationShutdown } from "@nestjs/common";
import { db, connectDatabase } from "./db.js";
import { listUsers, type StarterUser } from "./users.js";

@Injectable()
export class PrismaService implements OnModuleInit, OnApplicationShutdown {
  readonly db = db;

  async onModuleInit() {
    // Usa la funzione di connessione definita in db.ts con protezione singleton
    await connectDatabase();
  }

  async onApplicationShutdown() {
    if (typeof this.db.close === "function") {
      try {
        await this.db.close();
      } catch {
        // Ignora errori alla chiusura dell'app
      }
    }
  }

  listUsers(limit = 10): Promise<StarterUser[]> {
    return listUsers(limit);
  }
}
