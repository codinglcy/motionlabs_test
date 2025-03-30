import { Injectable } from "@nestjs/common";
import { Patient } from "src/entity";
import { getPatientsOptions, saveNewPatientsResponseDTO } from "src/DTOs";
import { DataSource, IsNull, Repository } from "typeorm";

@Injectable()
export class PatientRepository {
  private patientRepository: Repository<Patient>;

  constructor(private readonly dataSource: DataSource) {
    this.patientRepository = this.dataSource.getRepository(Patient);
  }

  async saveNewPatients(newPs: Patient[]): Promise<saveNewPatientsResponseDTO> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let updateCnt = 0;
      let insertCnt = 0;

      for (const patient of newPs) {
        let updateSet = {
          rrn: patient.rrn,
        };
        const noChartkey = {
          chart: IsNull(),
          name: patient.name,
          phone: patient.phone,
        };
        const chartKey = {
          chart: patient.chart,
          name: patient.name,
          phone: patient.phone,
        };

        if (patient.chart) {
          updateSet["chart"] = patient.chart;
        }
        if (patient.address) {
          updateSet["address"] = patient.address;
        }
        if (patient.memo) {
          updateSet["memo"] = patient.memo;
        }

        if (await queryRunner.manager.existsBy(Patient, noChartkey)) {
          // console.log(
          //   "*****************************noChartKey true*********************"
          // );
          await queryRunner.manager
            .update(Patient, noChartkey, updateSet)
            .then(() => {
              updateCnt = updateCnt + 1;
            });
        } else if (
          patient.chart &&
          (await queryRunner.manager.existsBy(Patient, chartKey))
        ) {
          // console.log(
          //   "*****************************chartKey true*********************"
          // );
          await queryRunner.manager
            .update(Patient, chartKey, updateSet)
            .then(() => {
              updateCnt = updateCnt + 1;
            });
        } else {
          // console.log(
          //   "***************************** insert *********************"
          // );
          await queryRunner.manager.insert(Patient, patient).then(() => {
            insertCnt = insertCnt + 1;
          });
        }
      }

      await queryRunner.commitTransaction();
      return {
        total: newPs.length,
        updated: updateCnt,
        inserted: insertCnt,
        failed: newPs.length - (updateCnt + insertCnt),
      };
    } catch (e) {
      console.log("++++++++ saveNewPatients transaction rollback ++++++++");
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async getPatients(
    options: getPatientsOptions,
    page: number,
    count: number
  ): Promise<{ patients: Patient[]; total: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    const findOptions = { take: count, skip: (page - 1) * count, where: {} };
    let patients: Patient[];
    let total: number;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (options.chart) {
        findOptions.where["chart"] = options.chart;
      }
      if (options.name) {
        findOptions.where["name"] = options.name;
      }
      if (options.phone) {
        findOptions.where["phone"] = options.phone;
      }
      console.log(findOptions);

      [patients, total] = await queryRunner.manager.findAndCount(
        Patient,
        findOptions
      );

      await queryRunner.commitTransaction();
      return { patients, total };
    } catch (e) {
      console.log("++++++++ getPatients transaction rollback ++++++++");
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
