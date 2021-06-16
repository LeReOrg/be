import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { urlencoded, json } from "express";
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
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ limit: "50mb", extended: true }));

  const config = app.get(ConfigService);
  const env = config.get<string>("environment");

  if (env !== "Production") {
    mongoose.set("debug", true);

    __initializeSwagger(app);

    app.enableCors();
  }

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
