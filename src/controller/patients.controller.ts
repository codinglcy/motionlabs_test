import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { AddPatientsService, GetPatientsService } from "../service";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import {
  patientDTO,
  addPatientsResponseDTO,
  getPatientsOptions,
  getPatientsResponseDTO,
} from "src/DTOs";

@Controller()
export class PatientsController {
  constructor(
    private readonly addService: AddPatientsService,
    private readonly getService: GetPatientsService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async addNewPatientsController(
    @UploadedFile() file: any
  ): Promise<void | addPatientsResponseDTO> {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0]; //첫번째 시트이름
    const sheet = workbook.Sheets[sheetName]; //첫번째 시트이름으로 해당 시트에 접근

    const patients = XLSX.utils.sheet_to_json<patientDTO>(sheet, {
      defval: null,
      header: ["chart", "name", "phone", "rrn", "address", "memo"],
      range: 1,
    });

    return this.addService.addNewPatients(patients);
  }

  @Get("/find")
  async getPatientsController(
    @Body() options: getPatientsOptions,
    @Query("page") page: number,
    @Query("count") count: number
  ): Promise<getPatientsResponseDTO> {
    return await this.getService.getPatinets(
      options,
      Number(page) ?? 1,
      Number(count) ?? 20
    );
  }
}
