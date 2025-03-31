import { Injectable } from "@nestjs/common";
import { Patient } from "../entity";
import {
  patientDTO,
  addPatientsResponseDTO,
  processedResponseDTO,
  saveNewPatientsResponseDTO,
} from "../DTOs";
import { PatientRepository } from "src/repository";

@Injectable()
export class AddPatientsService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async addNewPatients(
    patients: patientDTO[]
  ): Promise<addPatientsResponseDTO | void> {
    const saveResult = new addPatientsResponseDTO();
    const processDto = new processedResponseDTO();
    const saveDto = new saveNewPatientsResponseDTO();

    saveResult.totalRows = patients.length;

    //1. 검증
    const verifiedPatients = await this.verifyPatients(patients);
    processDto.afterVerify = verifiedPatients.length;

    //2. 중복병합
    const deduplicatedPatients = await this.deduplicatePatients(
      verifiedPatients
    );

    processDto.afterDeduplicate = deduplicatedPatients.length;
    saveResult.processedRows = deduplicatedPatients.length;
    saveResult.skippedRows = patients.length - deduplicatedPatients.length;

    //3. 저장
    const { total, updatedAndInserted, failed } = await this.savePatient(
      deduplicatedPatients
    );

    saveDto.total = total;
    saveDto.updatedAndInserted = updatedAndInserted;
    saveDto.failed = failed;
    processDto.save = saveDto;
    saveResult.process = processDto;

    return saveResult;
  }

  private verifyPatients(patients: patientDTO[]): patientDTO[] {
    try {
      const filteredPatients = patients.filter(
        (patient) =>
          (!patient.chart || patient.chart.length <= 255) &&
          patient.name &&
          patient.name.length >= 1 &&
          patient.name.length <= 255 &&
          patient.phone &&
          (/^01([0|1|6|7|8|9])-([0-9]{4})-([0-9]{4})$/.test(patient.phone) ||
            /^01([0|1|6|7|8|9])([0-9]{4})([0-9]{4})$/.test(patient.phone)) &&
          patient.rrn &&
          (/^\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])-?([0-4])(\d{0,6}|[*]{0,6})$/.test(
            patient.rrn
          ) ||
            /^\d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])$/.test(
              patient.rrn
            )) &&
          (!patient.address || patient.address.length <= 255) &&
          (!patient.memo || patient.memo.length <= 255)
      );
      return filteredPatients;
    } catch (e) {
      throw e;
    }
  }

  private deduplicatePatients(patients: patientDTO[]): Patient[] {
    try {
      let keysObj = {};
      let deduplicatedPatients = [];

      for (const p of patients) {
        const pPhone = p.phone.replace(/-/g, "");
        const pKey = p.chart + "\\" + p.name + "\\" + pPhone;
        const pKeyNochart = p.name + "\\" + pPhone;
        let pOld: Patient;

        if (p.chart) {
          if (pKey in keysObj) {
            pOld = deduplicatedPatients[keysObj[pKey]];
            deduplicatedPatients[keysObj[pKey]] = this.setNewP(p, pOld);
          } else {
            keysObj[pKey] = deduplicatedPatients.length;
            keysObj[pKeyNochart] = deduplicatedPatients.length;
            deduplicatedPatients.push(this.setNewP(p));
          }
        } else {
          if (pKeyNochart in keysObj) {
            pOld = deduplicatedPatients[keysObj[pKeyNochart]];
            deduplicatedPatients[keysObj[pKeyNochart]] = this.setNewP(p, pOld);
          } else {
            keysObj[pKeyNochart] = deduplicatedPatients.length;
            deduplicatedPatients.push(this.setNewP(p));
          }
        }
      }
      return deduplicatedPatients;
    } catch (e) {
      throw e;
    }
  }

  private setNewP(p: patientDTO, oldP?: Patient): Patient {
    try {
      let pNew = new Patient();
      const pPhone = p.phone.replace(/-/g, "");
      const rrn =
        p.rrn.length == 6 ? p.rrn + "0" : p.rrn.replace(/-/, "").slice(0, 7);
      const pRrn = rrn.slice(0, 6) + "-" + rrn.slice(6);

      if (oldP) {
        pNew.chart = oldP.chart ? p.chart ?? oldP.chart : p.chart;
        pNew.name = p.name;
        pNew.phone = pPhone;
        pNew.rrn = pRrn;
        pNew.address = oldP.address ? p.address ?? oldP.address : p.address;
        pNew.memo = oldP.memo ? p.memo ?? oldP.memo : p.memo;
      } else {
        pNew.chart = p.chart;
        pNew.name = p.name;
        pNew.phone = pPhone;
        pNew.rrn = pRrn;
        pNew.address = p.address;
        pNew.memo = p.memo;
      }
      return pNew;
    } catch (e) {
      throw e;
    }
  }

  private async savePatient(
    newPs: Patient[]
  ): Promise<saveNewPatientsResponseDTO> {
    return await this.patientRepository.saveNewPatients(newPs);
  }
}
