import { Injectable } from "@nestjs/common";
import { AddressesRepository } from "./addresses.repository";
import { Address } from "./schemas/address.schema";
import { CreateProductAddressDto } from "./dtos/create-product-address.dto";
import { User } from "src/users/schemas/user.schema";
import { CreateUserAddressDto } from "./dtos/create-user-address.dto";
import { FilterUserAddressesDto } from "./dtos/filter-user-addresses.dto";
import { PaginatedDocument } from "src/common/interfaces/paginated-document";
import { FilterQuery, Schema } from "mongoose";

@Injectable()
export class AddressesService {
  constructor(private __addressesRepository: AddressesRepository) {}

  public async createProductAddress(input: CreateProductAddressDto, user: User): Promise<Address> {
    return this.__addressesRepository.createOne({ ...input, user });
  }

  private async __changeUserDefaultAddress(user: User): Promise<void> {
    return this.__addressesRepository.updateOne(
      { user, isDefaultAddress: true },
      { isDefaultAddress: false },
    );
  }

  private async __changeUserPickupAddress(user: User): Promise<void> {
    return this.__addressesRepository.updateOne(
      { user, isPickupAddress: true },
      { isPickupAddress: false },
    );
  }

  private async __changeUserShippingAddress(user: User): Promise<void> {
    return this.__addressesRepository.updateOne(
      { user, isShippingAddress: true },
      { isShippingAddress: false },
    );
  }

  public async createUserAddress(input: CreateUserAddressDto, user: User): Promise<Address> {
    const existingAddress = await this.__addressesRepository.findOne({ user });

    const payload: Partial<Address> = input;

    if (existingAddress) {
      const tasks: Promise<any>[] = [];

      if (input.isDefaultAddress) {
        tasks.push(this.__changeUserDefaultAddress(user));
      }
      if (input.isPickupAddress) {
        tasks.push(this.__changeUserPickupAddress(user));
      }
      if (input.isShippingAddress) {
        tasks.push(this.__changeUserShippingAddress(user));
      }

      await tasks;
    } else {
      payload.isDefaultAddress = true;
      payload.isPickupAddress = true;
      payload.isShippingAddress = true;
      payload.user = user;
    }

    return this.__addressesRepository.createOne(payload);
  }

  public async filterAddresses(
    filters: {
      wards?: string[];
      districts?: string[];
      provinces?: string[];
      users?: User[];
    },
    options: {
      limit: number;
      page: number;
      sort?: any;
    },
  ) {
    const conditions: FilterQuery<Address> = {};

    if (filters) {
      const { wards, districts, provinces, users } = filters;

      if (wards?.length) {
        conditions.ward = { $in: wards };
      }
      if (districts?.length) {
        conditions.district = { $in: districts };
      }
      if (provinces?.length) {
        conditions.province = { $in: provinces };
      }
      if (users?.length) {
        conditions.user = { $in: users };
      }
    }

    return this.__addressesRepository.paginate(conditions, options);
  }
}
