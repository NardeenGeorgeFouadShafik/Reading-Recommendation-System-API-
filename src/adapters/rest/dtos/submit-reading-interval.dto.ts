import { IsNumber } from "class-validator";
export class SubmitReadingIntervalDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  bookId: number;
  @IsNumber()
  startPage: number;
  @IsNumber()
  endPage: number;
}
