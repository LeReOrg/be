import { Category } from "../../entities";
import { NotFoundError } from "../../../share/errors";

export class CategoriesRepository {
  construct = data => (new Category({
    name: data.name,
    thumbnail: data.thumbnail,
  }));

  insertToDB = data => this.construct(data).save();

  save = data => data.save();

  getAll = () => Category.find();

  getById = id => Category.findById(id);

  getByIdOrThrowError = async (id, error = NotFoundError) => {
    const document = await this.getById(id);
    if (!document) throw new error("Not Found Category");
    return document;
  };
};