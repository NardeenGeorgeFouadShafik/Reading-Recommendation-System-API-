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
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from "@nestjs/swagger";
import {
  LOGGING_SERVICE,
  LoggingService,
} from "../../../common/logging/logging.service";
import { RolesEnum } from "../../../domain/models/roles.enum";
import { Book, BookClass } from "../../../domain/models/book.model"; // Ensure Book is imported correctly
import { RolesGuard } from "../guards/roles.guard";
import { BOOK_SERVICE, BookService } from "src/domain/services/book.service";
import { Roles } from "../decorators/roles.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateBookDto } from "../dtos/create-book.dto";

@ApiTags("books")
@ApiBearerAuth()
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
  @ApiOperation({ summary: "Create a new book" })
  @ApiResponse({
    status: 201,
    description: "The book has been successfully created.",
    type: [BookClass],
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
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
  @ApiOperation({ summary: "Get top books" })
  @ApiResponse({
    status: 200,
    description: "Return top books.",
    type: [BookClass],
  })
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
  @ApiOperation({ summary: "Get a book by ID" })
  @ApiParam({
    name: "id",
    required: true,
    description: "ID of the book",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Return the book.",
    type: [BookClass],
  })
  @ApiResponse({ status: 404, description: "Book not found." })
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
  @ApiOperation({ summary: "Get all books" })
  @ApiResponse({
    status: 200,
    description: "Return all books.",
    type: [BookClass],
  })
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
