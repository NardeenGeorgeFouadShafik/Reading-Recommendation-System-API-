import { v4 as uuid } from "uuid";

export function generatePassword(): string {
  return uuid();
}
