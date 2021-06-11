import * as crypto from "crypto";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { UsersRepository } from "../users/users.repository";
import { RegisterRequestBodyDto } from "./dtos/register.request.dto";
import { User } from "../users/schemas/user.schema";
import { LoginRequestBodyDto } from "./dtos/login.request.dto";
import { JwtService } from "@nestjs/jwt";
import { UtilsHelper } from "../common/helpers/utils.helper";
import { ConfigService } from "@nestjs/config";
import { MailNotificationService } from "../notification/mail-notification.service";
import { RegisterAndLoginWithFirebaseRequestBodyDto } from "./dtos/register-login-firebase.request.dto";

@Injectable()
export class AuthenticationService {
  constructor(
    private __usersRepository: UsersRepository,
    private __jwtService: JwtService,
    private __configService: ConfigService,
    private __mailNotificationService: MailNotificationService,
  ) {}

  private __generateSalt(): string {
    return crypto.randomBytes(8).toString("hex").slice(0, 16);
  }

  private __hashPassword(password: string, salt: string): string {
    return crypto.createHmac("sha512", salt).update(password).digest("hex");
  }

  private async __validateRegisterInput(input: RegisterRequestBodyDto): Promise<void> {
    const userWithSameEmail = await this.__usersRepository.findOne({ email: input.email });

    if (userWithSameEmail) {
      throw new BadRequestException("Duplicated Email");
    }
  }

  public async register(input: RegisterRequestBodyDto): Promise<User> {
    await this.__validateRegisterInput(input);

    const salt = this.__generateSalt();
    const hash = this.__hashPassword(input.password, salt);

    return this.__usersRepository.createOne({
      email: input.email,
      displayName: input.displayName,
      phoneNumber: input.phoneNumber,
      salt,
      hash,
    });
  }

  private __isMatchPassword(password: string, user: User): boolean {
    const hashPassword = this.__hashPassword(password, user.salt);
    return hashPassword === user.hash;
  }

  public async validateLoginInput(input: LoginRequestBodyDto): Promise<User> {
    const user = await this.__usersRepository.findOne({ email: input.email });

    if (!user) {
      throw new BadRequestException("Invalid email");
    }

    const isMatchPassword = this.__isMatchPassword(input.password, user);

    if (!isMatchPassword) {
      throw new BadRequestException("Invalid password");
    }

    return user;
  }

  public async login(user: User): Promise<string> {
    const payload = { email: user.email };
    return this.__jwtService.signAsync(payload);
  }

  public async validateTokenPayload(payload: { email: string }): Promise<User> {
    const user = await this.__usersRepository.findOne({ email: payload.email });

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    return user;
  }

  public async changePassword(oldPassword: string, newPassword: string, user: User): Promise<void> {
    const isMatchPassword = this.__isMatchPassword(oldPassword, user);

    if (!isMatchPassword) {
      throw new BadRequestException("Invalid password");
    }

    const salt = user.salt;
    const hash = this.__hashPassword(newPassword, salt);

    return this.__usersRepository.updateOne({ _id: user._id }, { $set: { hash } });
  }

  public async forgotPassword(email: string): Promise<string> {
    const jwtSecretKey = this.__configService.get<string>("jwt.resetPasswordSecretKey");

    const otpCode = UtilsHelper.generateRandomString(6, { numericDigits: true });

    this.__mailNotificationService.sendForgotPasswordEmail(email, otpCode);

    await this.__usersRepository
      .updateOne({ email }, { "otp.resetPassword": otpCode })
      .catch(() => {
        console.log("Not Found User", email);
      });

    return this.__jwtService.signAsync({ email }, { secret: jwtSecretKey, expiresIn: 5 * 60 });
  }

  public verifyOtpCode(otpCode: string, user: User): void {
    const isMatchedOtpCode = otpCode === user.otp.resetPassword;

    if (!isMatchedOtpCode) {
      throw new BadRequestException("Invalid OTP Code");
    }
  }

  public async resetPassword(password: string, user: User): Promise<void> {
    const salt = user.salt;
    const hash = this.__hashPassword(password, salt);
    return this.__usersRepository.updateOne(
      { _id: user._id },
      {
        $set: { hash },
        $unset: { "otp.resetPassword": "" },
      },
    );
  }

  public async registerAndLoginWithFirebase(
    input: RegisterAndLoginWithFirebaseRequestBodyDto,
  ): Promise<{ token: string; user: User }> {
    const userWithSameEmail = await this.__usersRepository.findOne({
      email: input.email,
      uid: { $ne: input.uid },
    });

    if (userWithSameEmail) {
      throw new UnprocessableEntityException("Duplicate email");
    }

    const user = await this.__usersRepository.upsertOne(
      { email: input.email },
      {
        uid: input.uid,
        email: input.email,
        avatar: input.avatar,
        displayName: input.displayName,
      },
      {
        projection: {
          otp: 0,
          salt: 0,
          hash: 0,
        },
      },
    );

    if (!user) {
      throw new InternalServerErrorException("Upsert user failed", input.email);
    }

    const token = await this.login(user);

    return { token, user };
  }
}
