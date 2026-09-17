import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import type { LoginDto } from "./dto/login.dto";
import { Public } from "./decorators/public.decorator";

@Public()
@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() data: CreateAuthDto) {
    return await this.authService.register(data);
  }

  @Post("login")
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }
}
