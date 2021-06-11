import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { User, UserDocument } from "./schemas/user.schema";
import { BaseModel } from "../common/interfaces/base-model";

@Injectable()
export class UsersRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private __userModel: BaseModel<UserDocument>) {
    super(__userModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }
}
