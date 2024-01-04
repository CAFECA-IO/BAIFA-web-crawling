import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import Crawler from "./crawler";
import { config } from "dotenv";

const HTTP_PORT = process.env.HTTP_PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  config();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(HTTP_PORT);

  const crawler = new Crawler();
  crawler.start();
}
bootstrap();
