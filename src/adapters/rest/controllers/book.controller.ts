import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  LOGGING_SERVICE,
  LoggingService,
} from "../../../common/logging/logging.service";
import { RolesEnum } from "../../../domain/models/roles.enum";
import { Book } from "../../../domain/models/book.model";
import { RolesGuard } from "../guards/roles.guard";
import { BOOK_SERVICE, BookService } from "src/domain/services/book.service";
import { Roles } from "../decorators/roles.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateBookDto } from "../dtos/create-book.dto";

@Controller("api/books/")
export class BookController {
  private readonly LOG_CONTEXT = BookController.name;
  constructor(
    @Inject(BOOK_SERVICE) private bookService: BookService,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ROLE_ADMIN)
  async createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.createBook.name}`,
    );
    const book = await this.bookService.createBook({ ...createBookDto });

    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.createBook.name}`,
    );
    return book;
  }
  @Get("/top")
  @UseGuards(JwtAuthGuard)
  async getTopBooks(): Promise<Book[]> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getTopBooks.name}`,
    );
    const books = await this.bookService.getTopBooks();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getTopBooks.name}`,
    );
    return books;
  }
  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  async getBook(@Param("id", ParseIntPipe) id: number): Promise<Book> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.getBook.name}`);
    const book = await this.bookService.getBook(id);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getBook.name}`,
    );
    return book;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBooks(): Promise<Book[]> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getAllBooks.name}`,
    );
    const books = await this.bookService.getAllBooks();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getAllBooks.name}`,
    );
    return books;
  }
}
