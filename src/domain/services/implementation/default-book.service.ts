import { Inject } from "@nestjs/common";
import {
  LOGGING_SERVICE,
  LoggingService,
} from "../../../common/logging/logging.service";
import { Book } from "../../models/book.model";
import { BookService } from "../book.service";
import { BOOK_REPO, BookRepo } from "../../../domain/outbound/book.repo";

export class DefaultBookService implements BookService {
  private readonly LOG_CONTEXT = DefaultBookService.name;

  constructor(
    @Inject(BOOK_REPO) private bookRepo: BookRepo,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
  ) {}

  async getAllBooks(): Promise<Book[]> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getAllBooks.name}`,
    );
    const result = await this.bookRepo.findAll();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getAllBooks.name}`,
    );
    return result;
  }

  async createBook(book: Book): Promise<Book> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.createBook.name}`,
    );
    const savedBook = await this.bookRepo.insert(book);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.createBook.name}`,
    );
    return savedBook;
  }

  async getBook(bookId: number): Promise<Book> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.getBook.name}`);
    const result = await this.bookRepo.findOne(bookId);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getBook.name}`,
    );
    return result;
  }

  async getTopBooks(): Promise<Book[]> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getTopBooks.name}`,
    );
    const result = await this.bookRepo.getTopBooks();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getTopBooks.name}`,
    );
    return result;
  }
}
