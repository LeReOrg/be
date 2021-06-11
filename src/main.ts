import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as mongoose from "mongoose";

const __initializeSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle("Lere App")
    .setDescription("Lere API documentation")
    .setVersion("0.0.1")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api-doc", app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("/api/v1");
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  __initializeSwagger(app);

  mongoose.set("debug", true);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
