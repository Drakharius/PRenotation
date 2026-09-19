import { Inject, Injectable } from "@nestjs/common";
import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const host = this.configService.get<string>("REDIS_HOST");
    const port = Number(this.configService.get("REDIS_PORT"));
    const password = this.configService.get<string>("REDIS_PASSWORD");

    this.client = new Redis({
      host,
      port,
      password,
      maxRetriesPerRequest: null,
    });

    this.client.on("connect", () => {
      console.log("✅ Connesso a Redis Cloud con successo!");
    });

    this.client.on("error", (err) => {
      console.error("❌ Errore di connessione a Redis:", err);
    });
  }

  /**
   * Tenta di acquisire un lock atomico per una risorsa.
   * Usiamo l'opzione 'NX' (set solo se non esiste) e 'PX' (scadenza in millisecondi).
   */
  async acquireLock(key: string, ttlMs: number): Promise<string | null> {
    const token =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const result = await this.client.set(key, token, "PX", ttlMs, "NX");
    return result === "OK" ? token : null;
  }

  /**
   * Rilascia il lock solo se il token corrisponde, tramite script Lua atomico
   * per evitare di cancellare il lock di un altro processo se scaduto.
   */
  async releaseLock(key: string, token: string): Promise<boolean> {
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    const result = await this.client.eval(luaScript, 1, key, token);
    return result === 1;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, "EX", ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  onModuleDestroy() {
    this.client?.quit();
  }
}
