import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rawPort = (process.env.PORT ?? "").trim();
  const parsedPort = rawPort.length > 0 ? Number(rawPort) : Number.NaN;
  const port =
    Number.isFinite(parsedPort) && parsedPort >= 0 && parsedPort <= 65535
      ? parsedPort
      : 3000;
  await app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Rimuove campi non presenti nel DTO
      forbidNonWhitelisted: true, // Blocca richieste con campi extra
      transform: true, // Converte i tipi automaticamente (es. string -> number)
    }),
  );
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
