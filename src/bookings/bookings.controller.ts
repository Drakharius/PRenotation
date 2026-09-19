import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Inject,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

@Controller("bookings")
export class BookingsController {
  constructor(
    @Inject(BookingsService)
    private readonly bookingsService: BookingsService,
  ) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    return await this.bookingsService.create(req.user.userId, createBookingDto);
  }

  @Get()
  async findAll() {
    return await this.bookingsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return await this.bookingsService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return await this.bookingsService.update(id, updateBookingDto);
  }
}
