import { Injectable } from "@nestjs/common";
import { patientDTO } from "./db/patient.entity";

@Injectable()
export class AppService {
  verifyPatient(patients: patientDTO[]): void {
    // console.log(patients);
  }
}
