import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "patient" })
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() //차트번호
  chart: string;

  @Column() //이름
  name: string;

  @Column() //전화번호
  phone: string;

  @Column() //주민등록번호
  rrn: string;

  @Column() //주소
  address: string;

  @Column() //메모
  memo: string;
}
