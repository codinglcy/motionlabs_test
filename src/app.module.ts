import { Module } from "@nestjs/common";
import { AddPatientsController } from "./controller";
import { AddPatientsService } from "./service";
import { TypeOrmModule } from "@nestjs/typeorm";
import "dotenv/config";
import { Patient } from "./entity";
import { PatientRepository } from "./repository";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || ""),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [Patient],
      synchronize: true, //이후 false로 수정하기
      // logging: true,
      dropSchema: true,
    }),
  ],
  controllers: [AddPatientsController],
  providers: [AddPatientsService, PatientRepository],
})
export class AppModule {}
