import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
export class SubmitReadingIntervalDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  bookId: number;

  @ApiProperty()
  @IsNumber()
  startPage: number;

  @ApiProperty()
  @IsNumber()
  endPage: number;
}
