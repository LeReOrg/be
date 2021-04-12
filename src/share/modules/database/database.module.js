import mongoose from "mongoose";
import { LoggerModule } from "../logger/logger.module";

export class DatabaseModule {
  #logger = new LoggerModule("DatabaseModule");
  #uri;
  #options;

  constructor(uri, options) {
    this.#uri = uri;
    this.#options = options;
  }

  connect() {
    mongoose.connect(this.#uri, this.#options);
    mongoose.connection.on("error", error => this.#logger.error(error));
    mongoose.connection.on('open', () => this.#logger.info('Etablished connection to Mongo Atlas'));
  }
}