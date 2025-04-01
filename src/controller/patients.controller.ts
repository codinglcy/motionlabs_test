import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

@Controller()
export class PatientsController {
  constructor(
    private readonly addService: AddPatientsService,
    private readonly getService: GetPatientsService
  ) {}

  @ApiOperation({
    summary: "환자 등록 API",
    description: "Excel 파일 업로드를 통해 환자를 등록한다.",
  })
  @ApiBody({
    description:
      "등록할 환자데이터가 입력되어있는 Excel 파일 key값을 'file'로 지정하여 보내주면 된다.<br>항상 엑셀파일의 첫번째 시트를 읽어들이며, 해당 시트의 첫번째 열은 헤더인 것으로 가정.<br>열의 순서는 항상 차트번호, 이름 전화번호, 주민등록번호, 주소, 메모 순서여야 한다.",
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 201,
    description: "성공시 환자등록 현황 반환",
    type: getPatientsResponseDTO,
    example: {
      totalRows: 50900,
      processedRows: 49402,
      skippedRows: 1498,
      process: {
        afterVerify: 50493,
        afterDeduplicate: 49402,
        save: {
          total: 49402,
          updatedAndInserted: 49402,
          failed: 0,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "파일을 업로드 하지 않을 경우" })
  @ApiResponse({ status: 500, description: "요청 진행중 오류 발생할 경우" })
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async addNewPatientsController(
    @UploadedFile() file: any
  ): Promise<addPatientsResponseDTO> {
    if (!file) {
      throw new HttpException("파일을 등록해 주세요", HttpStatus.BAD_REQUEST);
    }
    try {
      const workbook = XLSX.read(file.buffer, { type: "buffer" });

      const sheetName = workbook.SheetNames[0]; //첫번째 시트이름
      const sheet = workbook.Sheets[sheetName]; //첫번째 시트이름으로 해당 시트에 접근

      const patients = XLSX.utils.sheet_to_json<patientDTO>(sheet, {
        defval: null,
        header: ["chart", "name", "phone", "rrn", "address", "memo"],
        range: 1,
      });

      return this.addService.addNewPatients(patients);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: "환자 목록 조회 API",
    description:
      "페이지별 환자 목록을 조회한다. & 차트번호/이름/전화번호로 환자를 검색할 수 있다.",
  })
  @ApiBody({
    type: getPatientsOptions,
    description:
      "차트번호/이름/전화번호로 다중조건 검색을 할 수 있다. 전체 환자를 검색하려면 각 값을 비워두면 된다.",
    examples: {
      "전체 조회": {
        value: { chart: "", name: "", phone: "" },
      },
      "(차트번호 1111) 조회": {
        value: { chart: "1111", name: "", phone: "" },
      },
      "(이름 홍길동) 조회": {
        value: { chart: "", name: "홍길동", phone: "" },
      },
      "(이름 홍길동, 전화번호 01000000000) 조회": {
        value: { chart: "", name: "홍길동", phone: "01000000000" },
      },
      "(차트번호 1111, 이름 홍길동, 전화번호 01000000000) 조회": {
        value: { chart: "1111", name: "홍길동", phone: "01000000000" },
      },
    },
  })
  @ApiQuery({
    name: "page",
    description: "조회할 페이지 (default: 1)",
    example: 2,
    type: Number,
  })
  @ApiQuery({
    name: "count",
    description: "한 페이지에 표시할 데이터 수 (default: 20)",
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: 201,
    description: "성공시 조건에 맞는 환자목록 반환",
    type: getPatientsResponseDTO,
    example: {
      total: 43,
      page: 13,
      count: 2,
      lastPage: 22,
      data: [
        {
          id: 25,
          chart: "421860",
          name: "김명숙",
          phone: "01011966980",
          rrn: "690823-0",
          address: "대구광역시 용산구 가락74길 611-2 (경희하마을)",
          memo: "약물 알레르기",
        },
        {
          id: 26,
          chart: "714091",
          name: "김영길",
          phone: "01011972137",
          rrn: "640911-4",
          address: "충청북도 의왕시 잠실5로 356 (지현손김읍)",
          memo: "수술 이력 있음",
        },
      ],
    },
  })
  @ApiResponse({ status: 500, description: "요청 진행중 오류 발생할 경우" })
  @Post("/find")
  async getPatientsController(
    @Body() options: getPatientsOptions,
    @Query("page") page?: number,
    @Query("count") count?: number
  ): Promise<getPatientsResponseDTO> {
    try {
      return await this.getService.getPatients(
        options,
        Number(page) ?? 1,
        Number(count) ?? 20
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
