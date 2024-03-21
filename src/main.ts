import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import Crawler from "./crawler";
import Parser from "./parser";
import ReportAndMint from "./create_report_mint_nft";
import { config } from "dotenv";
import { schedulePutReport } from "./parse/crawl_report";

if (process.env.NODE_ENV !== "production") {
  config();
}

const HTTP_PORT = process.env.HTTP_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(HTTP_PORT);

  const crawler = new Crawler();
  const parser = new Parser();
  // const reportAndMint = new ReportAndMint();

  // Promise.all([crawler.start()]);
  Promise.all([crawler.start(), parser.start()]);
  // Promise.all([parser.start()]);
  Promise.all([schedulePutReport()]);
  // Promise.all([reportAndMint.start(), parser.start()]);
}

bootstrap();
