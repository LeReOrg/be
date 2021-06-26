import { Body, Controller, Post, UseGuards, Request, Get, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticationService } from "./authentication.service";
import { LoginRequestBodyDto } from "./dtos/login.request.dto";
import { RegisterRequestBodyDto } from "./dtos/register.request.dto";
import { OkResponseBodyDto } from "../common/dtos/ok.response.dto";
import { LoginResponseBodyDto } from "./dtos/login.response.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { plainToClass } from "class-transformer";
import { UserDto } from "../users/dtos/user.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { ChangePasswordRequestBodyDto } from "./dtos/change-password.request.dto";
import { ForgotPasswordRequestBodyDto } from "./dtos/forgot-password.request.dto";
import { ForgotPasswordResponseBodyDto } from "./dtos/forgot-password.response.dto";
import { VerifyOtpCodeRequestBodyDto } from "./dtos/verify-otp-code.request.dto";
import { JwtResetPasswordAuthGuard } from "./guards/jwt-reset-password.guard";
import { ResetPasswordRequestBodyDto } from "./dtos/reset-password.request.dto";
import { RegisterAndLoginWithFirebaseRequestBodyDto } from "./dtos/register-login-firebase.request.dto";

@ApiTags("Authentication")
@Controller("/authentication")
export class AuthenticationController {
  constructor(private __authenticationService: AuthenticationService) {}

  @Post("/firebase")
  @ApiOperation({ summary: "Register/login with firebase" })
  @ApiResponse({ status: 200, type: LoginResponseBodyDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async registerAndLoginWithFirebase(
    @Body() input: RegisterAndLoginWithFirebaseRequestBodyDto,
  ): Promise<LoginResponseBodyDto> {
    const result = await this.__authenticationService.registerAndLoginWithFirebase(input);
    return plainToClass(LoginResponseBodyDto, result);
  }

  @Post("/register")
  @ApiOperation({ summary: "Manual register" })
  @ApiResponse({ status: 201, description: "Register successfully", type: OkResponseBodyDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async register(@Body() input: RegisterRequestBodyDto): Promise<OkResponseBodyDto> {
    await this.__authenticationService.register(input);
    return { status: "OK" };
  }

  @Post("/login")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Manual login" })
  @ApiBody({ type: LoginRequestBodyDto })
  @ApiResponse({ status: 201, description: "Return token and user", type: LoginResponseBodyDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async login(@Request() req): Promise<LoginResponseBodyDto> {
    const user = JSON.parse(JSON.stringify(req.user));
    const token = await this.__authenticationService.login(req.user);
    return plainToClass(LoginResponseBodyDto, { token, user });
  }

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get logged in user information" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 401, description: "Token is invalid" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async getProfile(@Request() req): Promise<UserDto> {
    const user = JSON.parse(JSON.stringify(req.user));
    return plainToClass(UserDto, user);
  }

  @Patch("/password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "User change password after login" })
  @ApiResponse({ status: 200, type: OkResponseBodyDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async changePassword(
    @Request() req,
    @Body() input: ChangePasswordRequestBodyDto,
  ): Promise<OkResponseBodyDto> {
    await this.__authenticationService.changePassword(input.password, input.newPassword, req.user);
    return { status: "OK" };
  }

  @Post("/password/email")
  @ApiOperation({
    summary:
      "Send email with OTP code and response OTP token." +
      "Using both of it to process further process of reset password",
    description: "User who register/login with Gmail can not use this feature",
  })
  @ApiResponse({ status: 200, type: ForgotPasswordResponseBodyDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 403, description: "User can not use this feature" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async forgotPassword(
    @Body() input: ForgotPasswordRequestBodyDto,
  ): Promise<ForgotPasswordResponseBodyDto> {
    const token = await this.__authenticationService.forgotPassword(input.email);
    return { token };
  }

  @Post("/password/otp-code")
  @UseGuards(JwtResetPasswordAuthGuard)
  @ApiOperation({ summary: "Verify OTP code and token" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "OTP code is valid", type: VerifyOtpCodeRequestBodyDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 401, description: "Token is invalid" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async verifyOtpCode(
    @Request() req,
    @Body() input: VerifyOtpCodeRequestBodyDto,
  ): Promise<OkResponseBodyDto> {
    this.__authenticationService.verifyOtpCode(input.otpCode, req.user);
    return { status: "OK" };
  }

  @Post("/password/reset")
  @UseGuards(JwtResetPasswordAuthGuard)
  @ApiOperation({ summary: "Reset password after verify OTP code and token" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 401, description: "Token is invalid" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async resetPassword(
    @Request() req,
    @Body() input: ResetPasswordRequestBodyDto,
  ): Promise<UserDto> {
    const result = await this.__authenticationService.resetPassword(input.password, req.user);
    return plainToClass(UserDto, result);
  }
}
