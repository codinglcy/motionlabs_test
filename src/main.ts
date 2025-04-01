import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import "dotenv/config";
import { HttpExceptionFilter } from "./middleware/customException";
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("Motionlabs Test API")
    .setDescription("엑셀 파일 업로드를 통한 환자등록 및 환자목록 조회 API")
    .setVersion("1.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, documentFactory);

  await app
    .listen(process.env.PORT ?? 5000)
    .then(() => console.log(`port ${process.env.PORT}에 연결되었습니다.`));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
