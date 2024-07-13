import { ApiProperty } from "@nestjs/swagger";

export interface Token {
  accessToken: string;
}

export class TokenClass implements Token {
  @ApiProperty()
  accessToken: string;
}
