import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Usa process.env.JWT_SECRET in produzione
    });
  }

  async validate(payload: any) {
    // payload contiene i dati decodificati dal token JWT
    if (!payload) {
      throw new UnauthorizedException("Token non valido");
    }
    // Ciò che ritorni qui viene iniettato automaticamente in req.user
    return { userId: payload.sub, email: payload.email };
  }
}
