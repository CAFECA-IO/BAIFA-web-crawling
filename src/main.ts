import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import Crawler from "./crawler";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const crawler = new Crawler();
  crawler.start();
}
bootstrap();
