import { Injectable } from "@nestjs/common";
import { AddressesRepository } from "./addresses.repository";
import { AddressType } from "./enum/address-type";
import { Address } from "./schemas/address.schema";
// import { Product } from "../products/schemas/product.schema";
import { CreateProductAddressDto } from "./dtos/create-product-address.dto";

@Injectable()
export class AddressesService {
  constructor(private __addressesRepository: AddressesRepository) {}

  public async createProductAddress(input: CreateProductAddressDto): Promise<Address> {
    return this.__addressesRepository.createOne({
      ...input,
      type: AddressType.Pickup,
    });
  }
}
