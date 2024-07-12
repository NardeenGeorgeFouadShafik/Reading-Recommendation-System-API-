import { BookEntity } from "./book.entity";
import { ReadingIntervalEntity } from "./reading-interval.entity";
import { UserEntity } from "./user.entity";

export const DATABASE_ENTITIES = [
  UserEntity,
  BookEntity,
  ReadingIntervalEntity,
];

export const enum EntitiesNamesEnum {
  User = "user",
  Book = " book",
  Reading_Interval = "reading_interval",
}

export const enum EntityUniqueColumnNamesEnum {
  EMAIL = "email",
}
