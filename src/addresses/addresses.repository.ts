import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { Address, AddressDocument } from "./schemas/address.schema";
import { BaseModel } from "../common/interfaces/base-model";

@Injectable()
export class AddressesRepository extends BaseRepository<AddressDocument> {
  constructor(@InjectModel(Address.name) private addressModel: BaseModel<AddressDocument>) {
    super(addressModel);
  }
}
