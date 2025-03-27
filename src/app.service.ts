import { Injectable } from "@nestjs/common";
import { Patient } from "./db/patient.entity";

@Injectable()
export class AppService {
  parsePatient(patients: Patient[]): void {
    console.log(patients);
  }
}
