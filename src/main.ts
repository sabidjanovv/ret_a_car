import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser";
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/helpers/winston-logging';
import { AllExceptionsFilter } from './common/helpers/error-handling';

async function start() {
  try {
    const PORT = process.env.PORT || 3030;
    console.log(PORT);

    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger(winstonConfig),
    });
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("api");
    app.useGlobalFilters(new AllExceptionsFilter());
    // app.useGlobalPipes(new CustomValidationPipe())

    const config = new DocumentBuilder()
      .setTitle("Rent a Car")
      .setDescription("Rent a Car REST API")
      .setVersion("1.0")
      .addTag(
        "NESTJS, validation, swagger, guard, sequelize, pg, mailer, bot, sms"
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    await app.listen(PORT, () => {
      console.log(`Server started at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
