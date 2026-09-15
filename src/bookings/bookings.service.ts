import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BookingsService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async create(data: CreateBookingDto) {
    const resourceExists =
      await this.prismaService.db.orm.public.Resource.where({
        id: data.resourceId,
      }).first();

    if (!resourceExists) {
      throw new NotFoundException("La risorsa richiesta non esiste");
    }

    const existingBooking =
      await this.prismaService.db.orm.public.Booking.where({
        resourceId: data.resourceId,
        status: "CONFIRMED",
      }).first();

    if (existingBooking) {
      throw new ConflictException("La risorsa è già prenotata");
    }

    if (data.isImmediate) {
      const resource = await this.prismaService.db.orm.public.Booking.create({
        resourceId: data.resourceId,
        userId: data.userId,
        status: "CONFIRMED",
      });
      return resource;
    }
    const resource = await this.prismaService.db.orm.public.Booking.create({
      resourceId: data.resourceId,
      userId: data.userId,
    });

    return resource;
  }

  async findAll() {
    const prenotation = await this.prismaService.db.orm.public.Booking.all();
    return prenotation;
  }

  async findOne(resourceId: number) {
    const prenotation = await this.prismaService.db.orm.public.Booking.where({
      id: resourceId,
    }).first();

    if (!prenotation) {
      throw new NotFoundException("Reservation not found");
    }
    return prenotation;
  }

  async update(resourceId: number, updateResourceDto: UpdateBookingDto) {
    const resourceUpdate = await this.prismaService.db.orm.public.Booking.where(
      {
        id: resourceId,
      },
    ).update(updateResourceDto);

    if (!resourceUpdate) {
      throw new NotFoundException("Reservation not found");
    }

    return resourceUpdate;
  }
}
