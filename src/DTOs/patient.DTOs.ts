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
  total: number;
  page: number;
  count: number;
  lastPage: number;
  data: Array<Patient>;
}

export class getPatientsOptions {
  chart: string;
  name: string;
  phone: string;
}
