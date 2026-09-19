import {
  Injectable,
  ConflictException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class BookingsService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => RedisService))
    private readonly redisService: RedisService,
  ) {}

  async create(userId: number, dto: CreateBookingDto) {
    const lockKey = `lock:resource:${dto.resourceId}:${dto.startTime}`;
    const lockToken = await this.redisService.acquireLock(lockKey, 5000);

    if (!lockToken) {
      throw new ConflictException(
        "Un altro utente sta elaborando una prenotazione per questo orario. Riprova tra qualche istante.",
      );
    }

    try {
      // 1. Converti la stringa ISO ricevuta dal DTO in un oggetto Temporal.Instant
      const startInstant = Temporal.Instant.from(dto.startTime);
      const endInstant = Temporal.Instant.from(dto.endTime);

      // 2. Controllo disponibilità nel DB
      const existingBooking =
        await this.prismaService.db.orm.public.Booking.where({
          resourceId: dto.resourceId,
          startTime: startInstant, // 👈 Deve essere l'oggetto startInstant, NON una stringa
          status: "CONFIRMED",
        }).first();

      if (existingBooking) {
        throw new ConflictException(
          "La risorsa è già stata prenotata per questo orario.",
        );
      }

      // 3. Creazione record
      const newBooking = await this.prismaService.db.orm.public.Booking.create({
        userId: userId,
        resourceId: dto.resourceId,
        startTime: startInstant, // 👈 Passiamo l'oggetto Temporal.Instant
        endTime: endInstant, // 👈 Passiamo l'oggetto Temporal.Instant
        status: "CONFIRMED",
      });

      await this.redisService.set(
        `cache:booking:${newBooking.id}`,
        JSON.stringify(newBooking),
        3600,
      );
      return newBooking;
    } finally {
      await this.redisService.releaseLock(lockKey, lockToken);
    }
  }

  async findAll() {
    return await this.prismaService.db.orm.public.Booking.all();
  }

  async findOne(id: number) {
    return await this.prismaService.db.orm.public.Booking.where({ id }).first();
  }
}
