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
  private config: MailConfig;
  private transporter: Mail<SentMessageInfo>;
  private templates: Partial<MailTemplates> = {};

  constructor(private configService: ConfigService) {
    const config = configService.get<MailConfig>("mail");

    if (!config) {
      throw new InternalServerErrorException("Not found config");
    }

    this.config = config;
    this.initializeTemplates();
    this.createTransport(config);
  }

  private getTemplateContent(relativePath: string): Promise<string> {
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

  private async initializeTemplates(): Promise<void> {
    const templates = await Promise.all([this.getTemplateContent(TemplatePaths.ForgotPassword)]);
    this.templates.forgotPassword = templates[0];
  }

  // Public this method for easy to write unit test
  public createTransport(config: MailConfig): void {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.username,
        pass: config.password,
      },
    });
  }

  public sendMail = (options: Mail.Options): Promise<SentMessageInfo> => {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  };

  public sendForgotPasswordEmail(receiverEmail: string, otpCode: string): void {
    this.sendMail({
      from: this.config.username,
      to: receiverEmail,
      subject: "[No-reply] Reset your password",
      html: this.templates.forgotPassword?.replace("{{code}}", otpCode),
    });
  }
}
