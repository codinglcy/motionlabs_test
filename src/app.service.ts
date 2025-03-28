import { Injectable } from "@nestjs/common";
import { patientDTO, Patient } from "./db/patient.entity";

@Injectable()
export class AppService {
  addNewPatients(patients: patientDTO[]): Patient[] | void {
    // console.log(patients);

    //1. 검증
    const verifiedPatients = this.verifyPatients(patients);
    console.log(
      `count patients: ${patients.length} / count verified patients: ${verifiedPatients.length}`
    );
    // console.log(verifiedPatients);

    //2. 중복병합
    const deduplicatedPatients = this.deduplicatePatients(verifiedPatients);
    // console.log(deduplicatedPatients);
    console.log(
      `count patients: ${patients.length} / count verified patients: ${verifiedPatients.length} / count deduplicated patients: ${deduplicatedPatients.length}`
    );

    return deduplicatedPatients;
    //3. 저장
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
      console.log(e);
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
      console.log(e);
    }
  }

  private setNewP(p: patientDTO, oldP?: Patient): Patient {
    try {
      let pNew = new Patient();
      const pPhone = p.phone.replace(/-/g, "");
      const rrn =
        p.rrn.length == 6 ? p.rrn + "0" : p.rrn.replace(/-/, "").slice(0, 7);
      const pRrn = rrn.slice(0, 6) + "-" + rrn.slice(6);
      // console.log(`${p.phone} -> ${pPhone} / ${p.rrn} -> ${pRrn}`);

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
      console.log(e);
    }
  }
}
