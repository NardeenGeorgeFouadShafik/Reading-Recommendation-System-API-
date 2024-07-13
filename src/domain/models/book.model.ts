import { ApiProperty } from "@nestjs/swagger";

export interface Book {
  id?: number;
  title: string;
  author: string;
  numOfPages: number;
  numOfReadPages?: number;
}

// For Swagger documentation purposes
export class BookClass implements Book {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  numOfPages: number;
  @ApiProperty()
  numOfReadPages?: number;
}
