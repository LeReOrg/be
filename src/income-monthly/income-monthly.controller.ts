import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IncomeMonthlyService } from "./income-monthly.service";
import { IncomeMonthlyDto } from "./dtos/income-monthly.dto";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { FilterIncomeMonthlyDto } from "./dtos/filter-income-monthly.dto";
import { plainToClassFromExist } from "class-transformer";

@Controller("/users/:userId/income-monthly")
@ApiTags("User Income Monthly")
export class IncomeMonthlyController {
  constructor(private incomeMonthlyService: IncomeMonthlyService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Retrieve a list of filtered income monthly",
    description: "Default sort by createdAt descending",
  })
  @ApiExtraModels(IncomeMonthlyDto, PaginatedDto)
  @ApiBearerAuth()
  @ApiPaginatedResponse(IncomeMonthlyDto)
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 403, description: "Users can only get their own incomes" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async findUserAddresses(
    @Request() req: any,
    @Param("userId") userId: string,
    @Query() input: FilterIncomeMonthlyDto,
  ): Promise<PaginatedDto<IncomeMonthlyDto>> {
    if (userId !== req.user.id) {
      throw new ForbiddenException("Users can only get their own incomes");
    }
    const result = await this.incomeMonthlyService.filterIncomeMonthly(
      {
        startDate: input.startDate,
        endDate: input.endDate,
        user: req.user,
      },
      {
        limit: input.limit,
        page: input.page,
        sort: input.sort,
      },
    );
    return plainToClassFromExist(new PaginatedDto<IncomeMonthlyDto>(IncomeMonthlyDto), result);
  }
}
