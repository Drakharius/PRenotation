import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService, // <-- Aggiunto @Inject esplicito
  ) {}

  private generateToken(userId: number, email: string) {
    const payload = { sub: userId, email: email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: CreateAuthDto) {
    const emailExists = await this.prismaService.db.orm.public.User.where({
      email: data.email,
    }).first();

    if (emailExists) {
      throw new ConflictException("Email already exists");
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.prismaService.db.orm.public.User.create({
      email: data.email,
      password: hashPassword,
    });

    return this.generateToken(newUser.id, newUser.email);
  }

  async login(data: LoginDto) {
    const user = await this.prismaService.db.orm.public.User.where({
      email: data.email,
    }).first();

    if (!user) {
      throw new UnauthorizedException("Credenziali non valide");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenziali non valide");
    }

    return this.generateToken(user.id, user.email);
  }
}
