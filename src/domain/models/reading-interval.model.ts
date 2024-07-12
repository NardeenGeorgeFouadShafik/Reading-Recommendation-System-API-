import { Book } from "./book.model";
import { User } from "./user.model";

export interface ReadingInterval {
  id?: number;
  startPage: number;
  endPage: number;
  user: Partial<User>;
  book: Partial<Book>;
}
