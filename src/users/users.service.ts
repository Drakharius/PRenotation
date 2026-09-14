import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";
@Injectable()
export class UsersService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async findAll() {
    const users = await this.prismaService.db.orm.public.User.all();
    return users;
  }

  async findOne(userId: number) {
    const user = await this.prismaService.db.orm.public.User.where({
      id: userId,
    }).first();

    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const userUpdate = await this.prismaService.db.orm.public.User.where({
      id: userId,
    }).update(updateUserDto);

    if (!userUpdate) {
      throw new NotFoundException("User not found");
    }

    return userUpdate;
  }

  async delete(userId: number) {
    const user = await this.prismaService.db.orm.public.User.where({
      id: userId,
    }).delete();

    if (!user) {
      throw new NotFoundException("User not found");
    }
    return console.log("User deleted successfully");
  }
}
