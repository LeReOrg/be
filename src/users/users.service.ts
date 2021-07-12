import { Injectable } from "@nestjs/common";
import { PaginatedRequestDto } from "../common/dtos/paginated.request.dto";
import { User } from "./schemas/user.schema";
import { UsersRepository } from "./users.repository";
import { PaginatedDocument } from "../common/interfaces/paginated-document";
import { Product } from "../products/schemas/product.schema";
import { FilterProductsDto } from "../products/dtos/filter-products.dto";
import { ProductsService } from "../products/products.service";

@Injectable()
export class UsersService {
  constructor(
    private __usersRepository: UsersRepository,
    private __productsService: ProductsService,
  ) {}

  public async fetchAll(input: PaginatedRequestDto): Promise<PaginatedDocument<User>> {
    const result = await this.__usersRepository.paginate(
      {},
      {
        limit: input.limit,
        page: input.page,
        sort: input.sort,
      },
    );
    return result;
  }

  public async updateUser(input: Partial<User>, user: User): Promise<User> {
    return this.__usersRepository.findByIdAndUpdate(user._id, { ...input });
  }

  public async filterProductsByUserId(
    id: string,
    input: FilterProductsDto,
  ): Promise<PaginatedDocument<Product>> {
    const user = await this.__usersRepository.findByIdOrThrowException(id);

    return this.__productsService.filterProducts(
      {
        users: [user],
        keyword: input.keyword,
        priceRange: input.priceRange,
        isTopProduct: input.isTopProduct,
        wards: input.wards,
        districts: input.districts,
        provinces: input.provinces,
        available: input.available,
      },
      {
        limit: input.limit,
        page: input.page,
        sort: input.sort,
        populate: input.populate,
      },
    );
  }
}
