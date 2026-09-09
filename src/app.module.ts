import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaService } from "./prisma.service";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ResourcesModule,
    BookingsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [PrismaService, UsersService],
})
export class AppModule {}
