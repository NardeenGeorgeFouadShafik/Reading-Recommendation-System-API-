import { ApiProperty } from "@nestjs/swagger";
import { Book } from "./book.model";
import { User } from "./user.model";

export interface ReadingInterval {
  id?: number;
  startPage: number;
  endPage: number;
  user: Partial<User>;
  book: Partial<Book>;
}
export class ReadingIntervalClass {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  bookId: number;

  @ApiProperty()
  startPage: number;

  @ApiProperty()
  endPage: number;
}
