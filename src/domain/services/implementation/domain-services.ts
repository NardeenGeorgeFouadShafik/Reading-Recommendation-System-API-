import { BOOK_SERVICE } from "../book.service";
import { READING_INTERVAL_SERVICE } from "../reading-interval.service";
import { USER_SERVICE } from "../user.service";
import { DefaultBookService } from "./default-book.service";
import { DefaultReadingIntervalService } from "./default-reading-interval.service";
import { DefaultUserService } from "./default-user.service";

export const DOMAIN_SERVICES = [
  {
    provide: USER_SERVICE,
    useClass: DefaultUserService,
  },
  {
    provide: BOOK_SERVICE,
    useClass: DefaultBookService,
  },
  {
    provide: READING_INTERVAL_SERVICE,
    useClass: DefaultReadingIntervalService,
  },
];
