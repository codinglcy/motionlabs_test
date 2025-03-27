import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import { Patient } from "./db/patient.entity";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async readExcelController(@UploadedFile() file: any) {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0]; //첫번째 시트이름
    const sheet = workbook.Sheets[sheetName]; //첫번째 시트이름으로 해당 시트에 접근

    const patients = XLSX.utils.sheet_to_json<Patient>(sheet, {
      defval: null,
      header: ["chart", "name", "phone", "rrn", "address", "memo"],
    });

    this.appService.parsePatient(patients);
  }
}
