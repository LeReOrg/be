import { User } from "../../entities";
import { NotFoundError } from "../../../share/errors";

class UsersRepository {
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

  get = (
    filter = {},
    options = {
      page: 1,
      limit: 10,
      // sort: {price: "asc", quanlity: "desc"},
    }
  ) => {
    const conditions = {};

    return User.paginate(conditions, {
      ...options,
      select: {
        hash: 0,
        salt: 0,
      },
    });
  };
};

const usersRepository = new UsersRepository();

Object.freeze(usersRepository);

export default usersRepository;