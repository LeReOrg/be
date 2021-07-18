import { Injectable } from "@nestjs/common";
import { AddressesRepository } from "./addresses.repository";
import { Address } from "./schemas/address.schema";
import { User } from "src/users/schemas/user.schema";
import { CreateUserAddressDto } from "./dtos/create-user-address.dto";
import { FilterQuery } from "mongoose";

@Injectable()
export class AddressesService {
  constructor(private addressesRepository: AddressesRepository) {}

  public async createAddress(input: Partial<Address>): Promise<Address> {
    return this.addressesRepository.createOne(input);
  }

  public async updateAddressById(id: any, update: any): Promise<Address> {
    return this.addressesRepository.findByIdAndUpdate(id, update);
  }

  private async changeUserDefaultAddress(user: User): Promise<void> {
    return this.addressesRepository.updateOne(
      { user, isDefaultAddress: true },
      { isDefaultAddress: false },
    );
  }

  private async changeUserPickupAddress(user: User): Promise<void> {
    return this.addressesRepository.updateOne(
      { user, isPickupAddress: true },
      { isPickupAddress: false },
    );
  }

  private async changeUserShippingAddress(user: User): Promise<void> {
    return this.addressesRepository.updateOne(
      { user, isShippingAddress: true },
      { isShippingAddress: false },
    );
  }

  public async createUserAddress(input: CreateUserAddressDto, user: User): Promise<Address> {
    const existingAddress = await this.addressesRepository.findOne({ user });

    const payload: Partial<Address> = input;

    if (existingAddress) {
      const tasks: Promise<any>[] = [];

      if (input.isDefaultAddress) {
        tasks.push(this.changeUserDefaultAddress(user));
      }
      if (input.isPickupAddress) {
        tasks.push(this.changeUserPickupAddress(user));
      }
      if (input.isShippingAddress) {
        tasks.push(this.changeUserShippingAddress(user));
      }

      await tasks;
    } else {
      payload.isDefaultAddress = true;
      payload.isPickupAddress = true;
      payload.isShippingAddress = true;
    }

    payload.user = user;

    return this.addressesRepository.createOne(payload);
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

    return this.addressesRepository.paginate(conditions, options);
  }
}
