import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "patient" })
@Unique(["chart", "name", "phone"])
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true }) //차트번호
  chart: string;

  @Column({ length: 255 }) //이름
  name: string;

  @Column({ length: 11 }) //전화번호
  phone: string;

  @Column({ length: 8 }) //주민등록번호
  rrn: string;

  @Column({ length: 255, nullable: true }) //주소
  address: string;

  @Column({ length: 255, nullable: true }) //메모
  memo: string;
}

export class patientDTO {
  @Column({ nullable: true }) //차트번호
  chart: string;

  @Column() //이름
  name: string;

  @Column() //전화번호
  phone: string;

  @Column() //주민등록번호
  rrn: string;

  @Column({ nullable: true }) //주소
  address: string;

  @Column({ nullable: true }) //메모
  memo: string;
}
