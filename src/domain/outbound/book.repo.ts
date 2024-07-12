import { Book } from "../models/book.model";

export const BOOK_REPO = Symbol("BOOK_REPO");
export interface BookRepo {
  findOne(bookId: number): Promise<Book>;

  insert(book: Partial<Book>): Promise<Book>;

  findAll(): Promise<Book[]>;

  getTopBooks(): Promise<Book[]>;
}
