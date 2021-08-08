import { ForbiddenException, Injectable } from "@nestjs/common";
import { AddressesRepository } from "./addresses.repository";
import { Address } from "./schemas/address.schema";
import { User } from "../users/schemas/user.schema";
import { CreateUserAddressDto } from "./dtos/create-user-address.dto";
import { UpdateUserAddressDto } from "./dtos/update-user-address.dto";
import { FilterQuery } from "mongoose";
import { AddressStatus } from "./enum/address-status";

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
    payload.status = AddressStatus.Active;

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
    const conditions: FilterQuery<Address> = { status: AddressStatus.Active };

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

  public async findUserAddressById(id: any, user: User): Promise<Address> {
    return this.addressesRepository.findUserAddressById(id, user);
  }

  public async updateUserAddressById(
    id: any,
    input: UpdateUserAddressDto,
    user: User,
  ): Promise<Address> {
    await this.findUserAddressById(id, user);
    const update: Partial<Address> = {};
    if (input.fullName) update.fullName = input.fullName;
    if (input.phoneNumber) update.phoneNumber = input.phoneNumber;
    if (input.latitude) update.latitude = input.latitude;
    if (input.longitude) update.longitude = input.longitude;
    if (input.street) update.street = input.street;
    if (input.ward) update.ward = input.ward;
    if (input.district) update.district = input.district;
    if (input.province) update.province = input.province;
    if (input.isDefaultAddress) await this.changeUserDefaultAddress(user);
    if (input.isPickupAddress) await this.changeUserPickupAddress(user);
    if (input.isShippingAddress) await this.changeUserShippingAddress(user);
    return this.addressesRepository.findByIdAndUpdate(id, update);
  }

  public async deleteUserAddressById(id: any, user: User): Promise<void> {
    const address = await this.findUserAddressById(id, user);
    const { isDefaultAddress, isPickupAddress, isShippingAddress } = address;
    if (isDefaultAddress || isPickupAddress || isShippingAddress) {
      throw new ForbiddenException("Could not delete default | pick up | shipping address");
    }
    return this.addressesRepository.updateOne(
      { _id: address._id },
      { status: AddressStatus.Inactive },
    );
  }

  // NOTE: This method is used to add "status" to existing user address which don't have
  public async updateUserAddresses(): Promise<void> {
    await this.addressesRepository.updateMany(
      { user: { $exists: true }, status: { $exists: false } },
      { status: AddressStatus.Active },
    );
  }
}
