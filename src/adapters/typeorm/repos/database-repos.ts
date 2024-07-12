import { USER_REPO } from "src/domain/outbound/user.repo";
import { TypeORMUserRepo } from "./typeorm-user.repo";
import { BOOK_REPO } from "src/domain/outbound/book.repo";
import { TypeORMBookRepo } from "./typeorm-book.repo";
import { READING_INTERVAL_REPO } from "src/domain/outbound/reading-interval.repo";
import { TypeORMReadingIntervalRepo } from "./typeorm-reading-interval.repo";

export const DATABASE_REPOS = [
  {
    provide: USER_REPO,
    useClass: TypeORMUserRepo,
  },
  {
    provide: BOOK_REPO,
    useClass: TypeORMBookRepo,
  },
  {
    provide: READING_INTERVAL_REPO,
    useClass: TypeORMReadingIntervalRepo,
  },
];
