import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Patient } from "../entity/patient.entity";

export class patientDTO {
  chart?: string;
  name: string;
  phone: string;
  rrn: string;
  address?: string;
  memo?: string;
}

export class addPatientsResponseDTO {
  totalRows: number;
  processedRows: number;
  skippedRows: number;
  process: processedResponseDTO;
}

export class processedResponseDTO {
  afterVerify: number;
  afterDeduplicate: number;
  save: saveNewPatientsResponseDTO;
}

export class saveNewPatientsResponseDTO {
  total: number;
  updated: number;
  inserted: number;
  failed: number;
}

export class getPatientsResponseDTO {
  @ApiProperty({ description: "조회된 전체 데이터 수" })
  total: number;
  @ApiProperty({ description: "표시할 페이지", default: 1 })
  page: number;
  @ApiProperty({ description: "한 페이지에 표시할 데이터 수", default: 20 })
  count: number;
  @ApiProperty({
    description: "전체 데이터 중 마지막 데이터가 표시될 마지막 페이지",
  })
  lastPage: number;
  @ApiProperty({ description: "조건에 맞는 환자 목록", type: [Patient] })
  data: Array<Patient>;
}

export class getPatientsOptions {
  @ApiPropertyOptional({ description: "차트번호" })
  chart: string;
  @ApiPropertyOptional({ description: "이름" })
  name: string;
  @ApiPropertyOptional({ description: "전화번호" })
  phone: string;
}
