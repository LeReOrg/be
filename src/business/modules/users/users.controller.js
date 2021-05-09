import usersService from "./users.service";
import { getUsersSchema } from "./users.schema";

class UsersController {
  get = async ({ reqQuery }) => {
    const input = await getUsersSchema.validateAsync(reqQuery);
    return usersService.get(input);
  };
};

const usersController = new UsersController();

Object.freeze(usersController);

export default usersController;