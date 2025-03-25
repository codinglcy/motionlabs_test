import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app
    .listen(process.env.PORT)
    .then(() => console.log(`port ${process.env.PORT}에 연결되었습니다.`));
}
bootstrap();
