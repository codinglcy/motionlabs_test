import { Module } from "@nestjs/common";
import { PatientsController } from "./controller";
import { AddPatientsService, GetPatientsService } from "./service";
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
      synchronize: true,
      // logging: true,
      dropSchema: true,
    }),
  ],
  controllers: [PatientsController],
  providers: [AddPatientsService, GetPatientsService, PatientRepository],
})
export class AppModule {}
