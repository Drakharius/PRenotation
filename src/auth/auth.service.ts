import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { hash } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async register(data: CreateAuthDto) {
    const emailExists = await this.prismaService.db.orm.public.User.where({
      email: data.email,
    }).first();
    if (emailExists) {
      throw new ConflictException("Email already exists");
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prismaService.db.orm.public.User.create({
      email: data.email,
      password: hashPassword,
    });
    return user;
  }

  async login(data: LoginDto) {
    const user = await this.prismaService.db.orm.public.User.where({
      email: data.email,
    }).first();
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException("Invalid password");
    }
    return user;
  }
}
