import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { getPatientsOptions, getPatientsResponseDTO } from "src/DTOs";
import { PatientRepository } from "src/repository";

@Injectable()
export class GetPatientsService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async getPatinets(
    opts: getPatientsOptions,
    page: number,
    count: number
  ): Promise<getPatientsResponseDTO> {
    try {
      const responseDTO = new getPatientsResponseDTO();

      const res = await this.patientRepository.getPatients(opts, page, count);

      responseDTO.total = res.total;
      responseDTO.page = page;
      responseDTO.count = count;
      responseDTO.lastPage = Math.ceil(res.total / count);
      responseDTO.data = res.patients;

      return responseDTO;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
