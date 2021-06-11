import { Injectable } from "@nestjs/common";
import { PaginatedRequestDto } from "../common/dtos/paginated.request.dto";
import { User } from "./schemas/user.schema";
import { UsersRepository } from "./users.repository";
import { PaginatedDocument } from "../common/interfaces/paginated-document";
import { ProductsRepository } from "../products/products.repository";
import { PaginatedProductsRequestDto } from "../products/dtos/paginated-products.request.dto";
import { Product } from "../products/schemas/product.schema";

@Injectable()
export class UsersService {
  constructor(
    private __usersRepository: UsersRepository,
    private __productsRepository: ProductsRepository,
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

  public async updateUser(user: User, input: Partial<User>): Promise<User> {
    return this.__usersRepository.findByIdAndUpdate(user._id, {
      displayName: input.displayName,
      phoneNumber: input.phoneNumber,
      birthDay: input.birthDay,
      gender: input.gender,
      isHirer: input.isHirer,
    });
  }

  public async fetchAllProductsByUserId(
    id: string,
    input: PaginatedProductsRequestDto,
  ): Promise<PaginatedDocument<Product>> {
    const user = await this.__usersRepository.findByIdOrThrowException(id);

    return this.__productsRepository.fetchAll(
      {
        rangedPrice: input.price,
        cities: input.cities?.split(","),
        isTopProduct: input.isTopProduct,
        user,
      },
      {
        limit: input.limit,
        page: input.page,
        sort: input.sort,
      },
    );
  }
}
