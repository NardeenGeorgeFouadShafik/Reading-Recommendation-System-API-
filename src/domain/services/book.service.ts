import { Book } from "../models/book.model";

export const BOOK_SERVICE = Symbol("BOOK_SERVICE");
export interface BookService {
  getBook(bookId: number): Promise<Book>;

  createBook(book: Partial<Book>): Promise<Book>;

  getAllBooks(): Promise<Book[]>;

  getTopBooks(): Promise<Book[]>;
}
