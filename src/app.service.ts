import { Injectable } from "@nestjs/common";
import { patientDTO } from "./db/patient.entity";

@Injectable()
export class AppService {
  verifyPatient(patients: patientDTO[]): void {
    // console.log(patients);
    const verifiedPatient = patients.filter((patient) => {
      return (
        (!patient.chart || patient.chart.length <= 255) &&
        patient.name &&
        patient.name.length >= 1 &&
        patient.name.length <= 255 &&
        patient.phone &&
        (/^01([0|1|6|7|8|9]?)-([0-9]{4})-([0-9]{4})$/.test(patient.phone) ||
          /^01([0|1|6|7|8|9]?)([0-9]{4})([0-9]{4})$/.test(patient.phone)) &&
        patient.rrn &&
        (/^\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])-?([0-4])(\d{0,6}|[*]{0,6})$/.test(
          patient.rrn
        ) ||
          /^\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])-?([0-4])$/.test(
            patient.rrn
          ) ||
          /^\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])$/.test(
            patient.rrn
          )) &&
        (!patient.address || patient.address.length <= 255) &&
        (!patient.memo || patient.memo.length <= 255)
      );
    });

    console.log(
      `count patients: ${patients.length} / count verified patients: ${verifiedPatient.length}`
    );
    console.log(verifiedPatient);
  }
}
