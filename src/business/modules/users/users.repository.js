import { User } from "../../entities";
import { NotFoundError } from "../../../share/errors";

export class UsersRepository {
  upsertOne = (condition, data) => {
    return User.findOneAndUpdate(condition, data, {
      upsert: true,
      new: true,
    });
  };

  findOne = (condition, projection) => {
    return User.findOne(condition, projection);
  };

  constructManualAuthenticationData = (data) => {
    return new User({
      email: data.email,
      displayName: data.displayName,
      phoneNumber: data.phoneNumber,
      salt: data.salt,
      hash: data.hash,
    });
  };

  save = (data) => {
    return data.save();
  };
};