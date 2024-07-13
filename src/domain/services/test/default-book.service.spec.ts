import { Test, TestingModule } from "@nestjs/testing";
import { DefaultBookService } from "../implementation/default-book.service";
import { Book } from "../../models/book.model";
import { BOOK_REPO, BookRepo } from "../../outbound/book.repo";
import { LocalLoggingService } from "../../../common/logging/local-logging.service";
import { ConfigService } from "@nestjs/config";
import { ClsService } from "nestjs-cls";
import { LOGGING_SERVICE } from "../../../common/logging/logging.service";
import { BOOK_SERVICE } from "../book.service";

describe("DefaultBookService", () => {
  let bookService: DefaultBookService;
  let bookRepo: BookRepo;
  let loggingService: LocalLoggingService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BOOK_SERVICE,
          useClass: DefaultBookService,
        },
        {
          provide: BOOK_REPO,
          useClass: class {
            insert = jest.fn();
            findAll = jest.fn();
            findOne = jest.fn();
            getTopBooks = jest.fn();
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("DEBUG,INFO,ERROR"),
          },
        },
        {
          provide: ClsService,
          useValue: {
            getId: jest.fn().mockReturnValue("12345"),
          },
        },
        {
          provide: LOGGING_SERVICE,
          useClass: LocalLoggingService,
        },
      ],
    }).compile();

    bookService = moduleRef.get<DefaultBookService>(BOOK_SERVICE);
    bookRepo = moduleRef.get<BookRepo>(BOOK_REPO);
    loggingService = moduleRef.get<LocalLoggingService>(LOGGING_SERVICE);
  });

  it("should be defined", () => {
    expect(bookService).toBeDefined();
  });

  describe("createBook", () => {
    it("should create a book", async () => {
      const book1: Book = {
        id: 1,
        title: "Book 1",
        author: "Author 1",
        numOfPages: 200,
      };

      jest.spyOn(bookRepo, "insert").mockResolvedValueOnce(book1 as any);
      jest.spyOn(loggingService, "debug");

      const result = await bookService.createBook(book1);
      expect(result).toEqual(book1);

      expect(bookRepo.insert).toHaveBeenCalledTimes(1);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultBookService.name,
        "started createBook",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultBookService.name,
        "finished createBook",
      );
    });
  });

  describe("getAllBooks", () => {
    it("should return all books", async () => {
      const books: Book[] = [
        { id: 1, title: "Book 1", author: "Author 1", numOfPages: 200 },
        { id: 2, title: "Book 2", author: "Author 2", numOfPages: 300 },
      ];

      jest.spyOn(bookRepo, "findAll").mockResolvedValueOnce(books);
      jest.spyOn(loggingService, "debug");

      const result = await bookService.getAllBooks();
      expect(result).toEqual(books);

      expect(bookRepo.findAll).toHaveBeenCalledTimes(1);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultBookService.name,
        "started getAllBooks",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultBookService.name,
        "finished getAllBooks",
      );
    });
  });

  describe("getBook", () => {
    it("should return a book by ID", async () => {
      const book: Book = {
        id: 1,
        title: "Book 1",
        author: "Author 1",
        numOfPages: 200,
      };

      jest.spyOn(bookRepo, "findOne").mockResolvedValueOnce(book);
      jest.spyOn(loggingService, "debug");

      const result = await bookService.getBook(1);
      expect(result).toEqual(book);

      expect(bookRepo.findOne).toHaveBeenCalledTimes(1);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultBookService.name,
        "started getBook",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultBookService.name,
        "finished getBook",
      );
    });
  });

  describe("getTopBooks", () => {
    it("should return top books", async () => {
      const books: Book[] = [
        { id: 1, title: "Book 1", author: "Author 1", numOfPages: 200 },
        { id: 2, title: "Book 2", author: "Author 2", numOfPages: 300 },
      ];

      jest.spyOn(bookRepo, "getTopBooks").mockResolvedValueOnce(books);
      jest.spyOn(loggingService, "debug");

      const result = await bookService.getTopBooks();
      expect(result).toEqual(books);

      expect(bookRepo.getTopBooks).toHaveBeenCalledTimes(1);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultBookService.name,
        "started getTopBooks",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultBookService.name,
        "finished getTopBooks",
      );
    });
  });
});
