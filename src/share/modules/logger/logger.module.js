import winston from "winston";
import util from "util";

const { combine, colorize, timestamp, label, printf } = winston.format;

export class LoggerModule {
  context = "Default";

  constructor(context) {
    this.context = context;
    this.createLogger();
  }

  #formatMessage(info) {
    const { level, timestamp, label, message } = info;
    return `[${level}][${timestamp}][${label}] - ${message}`;
  }

  createLogger() {
    this.winston = winston.createLogger({
      format: combine(
        colorize(),
        timestamp({ format: () => new Date().toLocaleString() }),
        label({ label: this.context }),
        printf(this.#formatMessage),
      ),
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  info(...args) {
    this.winston.log({
      level: 'info',
      message: util.format(...args),
    });
  }

  error(...args) {
    this.winston.log({
      level: 'error',
      message: util.format(...args),
    });
  }
};