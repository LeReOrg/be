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
import { IncomesService } from "./incomes.service";
import { IncomeDto } from "./dtos/income.dto";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { FilterIncomesDto } from "./dtos/filter-incomes.dto";

@Controller("/users/:userId/incomes")
@ApiTags("User Incomes")
export class IncomesController {
  constructor(private incomesService: IncomesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Retrieve a list of filtered incomes",
    description: "Default sort by createdAt descending",
  })
  @ApiExtraModels(IncomeDto, PaginatedDto)
  @ApiBearerAuth()
  @ApiPaginatedResponse(IncomeDto)
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 403, description: "Users can only get their own incomes" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async findUserAddresses(
    @Request() req: any,
    @Param("userId") userId: string,
    @Query() input: FilterIncomesDto,
  ): Promise<PaginatedDto<IncomeDto>> {
    if (userId !== req.user.id) {
      throw new ForbiddenException("Users can only get their own incomes");
    }
    const result = await this.incomesService.filterIncomes(
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
    return plainToClassFromExist(new PaginatedDto<IncomeDto>(IncomeDto), result);
  }

  @Get("/:incomeId")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Find income detail by income id" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: IncomeDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 403, description: "Users can only get their own incomes" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  async findIncomeDetailById(
    @Request() req: any,
    @Param("userId") userId: string,
    @Param("incomeId") incomeId: string,
  ): Promise<IncomeDto> {
    if (userId !== req.user.id) {
      throw new ForbiddenException("Users can only get their own incomes");
    }
    const result = await this.incomesService.findIncomeDetailById(incomeId);
    return plainToClass(IncomeDto, result);
  }
}
