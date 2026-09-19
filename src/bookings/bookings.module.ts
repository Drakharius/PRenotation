import { forwardRef, Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";
import { RedisModule } from "../redis/redis.module";
import { PrismaModule } from "../prisma/prisma.model";

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => RedisModule), // forwardRef per prevenire dipendenze circolari
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
