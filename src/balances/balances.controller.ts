import { Controller, ForbiddenException, Get, Param, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BalancesService } from "./balances.service";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { BalanceDto } from "./dtos/balance.dto";
import { plainToClass } from "class-transformer";

@Controller("/users/:userId/balances")
@ApiTags("User Balances")
export class BalancesController {
  constructor(private balancesService: BalancesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Retrieve balance of user by id",
    description: "Users can only get their own balance",
  })
  @ApiResponse({ status: 200, type: BalanceDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async findBalanceByUserId(
    @Request() req: any,
    @Param("userId") userId: string,
  ): Promise<BalanceDto> {
    if (userId !== req.user.id) {
      throw new ForbiddenException("Users can only get their own balance");
    }
    const result = await this.balancesService.findBalanceByUserId(userId);
    return plainToClass(BalanceDto, result);
  }
}
