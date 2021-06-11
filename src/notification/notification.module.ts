import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailNotificationService } from "./mail-notification.service";

@Module({
  imports: [ConfigModule],
  providers: [MailNotificationService],
  exports: [MailNotificationService],
})
export class NotificationModule {}
