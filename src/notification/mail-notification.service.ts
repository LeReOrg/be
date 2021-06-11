import * as nodemailer from "nodemailer";
import * as fs from "fs";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailConfig } from "../config/interfaces/mail.config";
import { MailTemplates } from "./interfaces/mail-templates";
import { TemplatePaths } from "./constants";
import Mail = require("nodemailer/lib/mailer");
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";

@Injectable()
export class MailNotificationService {
  private __config: MailConfig;
  private __transporter: Mail<SentMessageInfo>;
  private __templates: Partial<MailTemplates> = {};

  constructor(private __configService: ConfigService) {
    const config = __configService.get<MailConfig>("mail");

    if (!config) {
      throw new InternalServerErrorException("Not found config");
    }

    this.__config = config;
    this.__initializeTemplates();
    this.createTransport(config);
  }

  private __getTemplateContent(relativePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `${__dirname}/../../${relativePath}`;

      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data.toString());
      });
    });
  }

  private async __initializeTemplates(): Promise<void> {
    const templates = await Promise.all([this.__getTemplateContent(TemplatePaths.ForgotPassword)]);
    this.__templates.forgotPassword = templates[0];
  }

  // Public this method for easy to write unit test
  public createTransport(config: MailConfig): void {
    this.__transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.username,
        pass: config.password,
      },
    });
  }

  public sendMail = (options: Mail.Options): Promise<SentMessageInfo> => {
    return new Promise((resolve, reject) => {
      this.__transporter.sendMail(options, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  };

  public sendForgotPasswordEmail(receiverEmail: string, otpCode: string): void {
    this.sendMail({
      from: this.__config.username,
      to: receiverEmail,
      subject: "[No-reply] Reset your password",
      html: this.__templates.forgotPassword?.replace("{{code}}", otpCode),
    });
  }
}
