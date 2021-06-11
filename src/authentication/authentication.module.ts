import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { NotificationModule } from "../notification/notification.module";
import { JwtResetPasswordStrategy } from "./strategies/jwt-reset-password.strategy";

/**
 * The secret key in JwtStrategy was used to decode
 * The secret key here in JwtModule.register was used to encode
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secretKey"),
      }),
    }),
    NotificationModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy, JwtResetPasswordStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
