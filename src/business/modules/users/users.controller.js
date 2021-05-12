import usersService from "./users.service";
import {
  getUsersSchema,
  updateProfileSchema,
} from "./users.schema";

class UsersController {
  get = async ({ reqQuery }) => {
    const input = await getUsersSchema.validateAsync(reqQuery);
    return usersService.get(input);
  };

  updateProfile = async ({ reqBody, requestedBy }) => {
    const input = await updateProfileSchema.validateAsync(reqBody);
    return usersService.updateProfile(input, requestedBy);
  };
};

const usersController = new UsersController();

Object.freeze(usersController);

export default usersController;