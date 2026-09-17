// src/app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { ResourcesModule } from "./resources/resources.module";
import { BookingsModule } from "./bookings/bookings.module";
import { PrismaModule } from "./prisma/prisma.model";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    ResourcesModule,
    BookingsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // NestJS inietterà automaticamente Reflector nel costruttore!
    },
  ],
})
export class AppModule {}
