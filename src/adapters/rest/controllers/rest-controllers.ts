import { BookController } from "./book.controller";
import { ReadingIntervalController } from "./reading-interval.controller";
import { UserController } from "./user.controller";

export const REST_CONTROLLERS = [
  UserController,
  BookController,
  ReadingIntervalController,
];
