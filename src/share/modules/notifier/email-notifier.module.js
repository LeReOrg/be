import { ConfigModule } from "../config/config.module";
import { LoggerModule } from "../logger/logger.module";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

class EmailNotifier {
  #logger;
  #forgotPasswordEmailTemplate;

  constructor() {
    this.#logger = new LoggerModule("EmailNotifiter");
    this.mailConfig = ConfigModule.retrieveConfig("mail"),
    this.#createTransport();
    this.#getForgotPasswordEmailTemplate();
  }

  #createTransport = () => {
    this.transporter = nodemailer.createTransport({
      service: this.mailConfig.service,
      auth: {
        user: this.mailConfig.username,
        pass: this.mailConfig.password
      }
    });
  }

  #getForgotPasswordEmailTemplate = () => {
    const filePath = __dirname + "/templates/forgot-password-email.html";

    fs.readFile(filePath, (err, data) => {
      if (err) {
        this.#logger.error(err);
        return process.exit();
      }

      this.#forgotPasswordEmailTemplate = data.toString();
    });
  }

  #sendMail = (data) => {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(data, (error, info) => {
        if (error) {
          return reject(error);
        }
        return resolve(info);
      });
    });
  } ;

  sendForgotPasswordEmail = (receiverEmail, otpCode) => {
    const message = {
      from: this.mailConfig.username,
      to: receiverEmail,
      subject: "Reset your password",
      html: this.#forgotPasswordEmailTemplate.replace("{{code}}", otpCode),
    };
    return this.#sendMail(message);
  };
};

const emailNotifier = new EmailNotifier();

Object.freeze(emailNotifier);

export default emailNotifier;