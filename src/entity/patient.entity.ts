import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "patient" })
@Unique(["chart", "name", "phone"])
export class Patient {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "id" })
  id: number;

  @Column({ length: 255, nullable: true })
  @ApiPropertyOptional({ description: "차트번호" })
  chart?: string;

  @Column({ length: 255 })
  @ApiProperty({ description: "이름" })
  name: string;

  @Column({ length: 11 })
  @ApiProperty({ description: "전화번호" })
  phone: string;

  @Column({ length: 8 })
  @ApiProperty({ description: "주민등록번호" })
  rrn: string;

  @Column({ length: 255, nullable: true })
  @ApiPropertyOptional({ description: "주소" })
  address?: string;

  @Column({ length: 255, nullable: true })
  @ApiPropertyOptional({ description: "메모" })
  memo?: string;
}
