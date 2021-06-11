import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "../../users/schemas/user.schema";
import { AuthenticationService } from "../authentication.service";

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(Strategy, "jwt-reset-password") {
  constructor(
    private __configService: ConfigService,
    private __authenticationService: AuthenticationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: __configService.get<string>("jwt.resetPasswordSecretKey"),
    });
  }

  // TODO: create an interface for this payload
  async validate(payload: any): Promise<User> {
    return this.__authenticationService.validateTokenPayload(payload);
  }
}
