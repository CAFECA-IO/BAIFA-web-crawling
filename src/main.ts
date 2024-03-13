import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import Crawler from "./crawler";
import Parser from "./parser";
import ReportAndMint from "./create_report_mint_nft";
import { config } from "dotenv";

const HTTP_PORT = process.env.HTTP_PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  config();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(HTTP_PORT);

  const crawler = new Crawler();
  const parser = new Parser();
  const reportAndMint = new ReportAndMint();

  // Promise.all([crawler.start()]);
  Promise.all([crawler.start(), parser.start()]);
  // Promise.all([reportAndMint.start(), parser.start()]);
}

bootstrap();
