import usersRepository from "../users/users.repository";

class UsersService {
  get = ({
    page,
    limit,
    sort,
  }) => {
    const customSort = {};

    if (sort) sort.split(",").forEach(item => {
      if (item) {
        const fieldValuePair = item.split(":");
        const field = fieldValuePair[0];
        const value = fieldValuePair[1];
        customSort[field] = value;
      }
    });

    return usersRepository.get({}, {
      page,
      limit,
      sort: customSort,
    });
  };

  updateProfile = async (input, requestedBy) => {
    return usersRepository.findByIdAndUpdate(requestedBy.id, input);
  };
};

const usersService = new UsersService();

Object.freeze(usersService);

export default usersService;