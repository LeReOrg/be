import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { Address, AddressDocument } from "./schemas/address.schema";
import { BaseModel } from "../common/interfaces/base-model";
import { User } from "../users/schemas/user.schema";
import { AddressStatus } from "./enum/address-status";

@Injectable()
export class AddressesRepository extends BaseRepository<AddressDocument> {
  constructor(@InjectModel(Address.name) private addressModel: BaseModel<AddressDocument>) {
    super(addressModel);
  }

  async findUserAddressById(id: string, user: User): Promise<AddressDocument> {
    const result = await this.addressModel.findOne({ _id: id, user, status: AddressStatus.Active });
    if (!result) {
      throw new NotFoundException("Not found user address");
    }
    return result;
  }
}
