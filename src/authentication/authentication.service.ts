import * as crypto from "crypto";
import {
  BadRequestException,
  ForbiddenException,
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
import { BalancesService } from "../balances/balances.service";

@Injectable()
export class AuthenticationService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailNotificationService: MailNotificationService,
    private balancesService: BalancesService,
  ) {}

  private generateSalt(): string {
    return crypto.randomBytes(8).toString("hex").slice(0, 16);
  }

  private hashPassword(password: string, salt: string): string {
    return crypto.createHmac("sha512", salt).update(password).digest("hex");
  }

  private async validateRegisterInput(input: RegisterRequestBodyDto): Promise<void> {
    const userWithSameEmail = await this.usersRepository.findOne({ email: input.email });

    if (userWithSameEmail) {
      throw new BadRequestException("Duplicated Email");
    }
  }

  public async register(input: RegisterRequestBodyDto): Promise<User> {
    await this.validateRegisterInput(input);

    const salt = this.generateSalt();
    const hash = this.hashPassword(input.password, salt);

    const user = await this.usersRepository.createOne({
      email: input.email,
      displayName: input.displayName,
      phoneNumber: input.phoneNumber,
      role: input.role,
      salt,
      hash,
    });

    await this.balancesService.openUserBalance(user);

    return user;
  }

  private isMatchPassword(password: string, user: User): boolean {
    const hashPassword = this.hashPassword(password, user.salt);
    return hashPassword === user.hash;
  }

  public async validateLoginInput(input: LoginRequestBodyDto): Promise<User> {
    const user = await this.usersRepository.findOne({ email: input.email });

    if (!user) {
      throw new BadRequestException("Invalid email");
    }

    if (user.uid) {
      throw new ForbiddenException(
        "This email already register with Firebase. Please use login with firebase to continue",
      );
    }

    const isMatchPassword = this.isMatchPassword(input.password, user);

    if (!isMatchPassword) {
      throw new BadRequestException("Invalid password");
    }

    return user;
  }

  public async login(user: User): Promise<string> {
    const payload = { email: user.email };
    return this.jwtService.signAsync(payload);
  }

  public async validateTokenPayload(payload: { email: string }): Promise<User> {
    const user = await this.usersRepository.findOne({ email: payload.email });

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    return user;
  }

  public async changePassword(oldPassword: string, newPassword: string, user: User): Promise<void> {
    const isMatchPassword = this.isMatchPassword(oldPassword, user);

    if (!isMatchPassword) {
      throw new BadRequestException("Invalid password");
    }

    const salt = user.salt;
    const hash = this.hashPassword(newPassword, salt);

    return this.usersRepository.updateOne({ _id: user._id }, { $set: { hash } });
  }

  public async forgotPassword(email: string): Promise<string> {
    const user = await this.usersRepository.findOne({ email });

    if (user && user.uid) {
      throw new ForbiddenException(
        "User who register with 3rd-party (E.g: Firebase) can not use this feature",
      );
    }

    const jwtSecretKey = this.configService.get<string>("jwt.resetPasswordSecretKey");

    const otpCode = UtilsHelper.generateRandomString(6, { numericDigits: true });

    this.mailNotificationService.sendForgotPasswordEmail(email, otpCode);

    await this.usersRepository.updateOne({ email }, { "otp.resetPassword": otpCode }).catch(() => {
      console.log("Not Found User", email);
    });

    return this.jwtService.signAsync({ email }, { secret: jwtSecretKey, expiresIn: 5 * 60 });
  }

  public verifyOtpCode(otpCode: string, user: User): void {
    const isMatchedOtpCode = otpCode === user.otp.resetPassword;

    if (!isMatchedOtpCode) {
      throw new BadRequestException("Invalid OTP Code");
    }
  }

  public async resetPassword(password: string, user: User): Promise<User> {
    const salt = user.salt;
    const hash = this.hashPassword(password, salt);
    return this.usersRepository.findByIdAndUpdate(user._id, {
      $set: { hash },
      $unset: { "otp.resetPassword": "" },
    });
  }

  public async registerAndLoginWithFirebase(
    input: RegisterAndLoginWithFirebaseRequestBodyDto,
  ): Promise<{ token: string; user: User }> {
    const userWithSameEmail = await this.usersRepository.findOne({
      email: input.email,
      uid: { $ne: input.uid },
    });

    if (userWithSameEmail) {
      throw new UnprocessableEntityException("Duplicate email");
    }

    const user = await this.usersRepository.upsertOne(
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

    await this.balancesService.openUserBalance(user);

    const token = await this.login(user);

    return { token, user };
  }
}
