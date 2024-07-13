import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  LOGGING_SERVICE,
  LoggingService,
} from "../../../common/logging/logging.service";
import { BookRepo } from "src/domain/outbound/book.repo";
import { BookEntity } from "../entities/book.entity";
import { Book } from "src/domain/models/book.model";
import { EntitiesNamesEnum } from "../entities/database-entities";

@Injectable()
export class TypeORMBookRepo implements BookRepo {
  private readonly LOG_CONTEXT = TypeORMBookRepo.name;

  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<Book>,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
  ) {}

  async findOne(bookId: number): Promise<Book> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.findOne.name}`);
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.findOne.name}`,
    );
    return book;
  }

  async insert(book: Book): Promise<Book> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.insert.name}`);
    const result = await this.bookRepository.save({
      ...book,
    });
    this.loggingService.debug(this.LOG_CONTEXT, `finished ${this.insert.name}`);
    return result;
  }

  async findAll(): Promise<Book[]> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.findAll.name}`);
    const query = await this.bookRepository.createQueryBuilder(
      EntitiesNamesEnum.Book,
    );
    const result = await query.getMany();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.findAll.name}`,
    );
    return result;
  }

  async getTopBooks(): Promise<Book[]> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getTopBooks.name}`,
    );
    const query = this.bookRepository
      .createQueryBuilder(EntitiesNamesEnum.Book)
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select(
              "DISTINCT ON (page_numbers.book_id, page_numbers.page) page_numbers.book_id",
              "book_id",
            )
            .addSelect("page_numbers.page", "page")
            .from((subSubQuery) => {
              return subSubQuery
                .select("readingInterval.book_id", "book_id")
                .addSelect(
                  "generate_series(readingInterval.start_page, readingInterval.end_page)",
                  "page",
                )
                .from("reading_interval", "readingInterval");
            }, "page_numbers");
        },
        "unique_pages",
        "book.id = unique_pages.book_id",
      )
      .addSelect("COUNT(unique_pages.page)", "book_num_of_read_pages")
      .groupBy("book.id")
      .addGroupBy("book.title")
      .addGroupBy("book.author")
      .addGroupBy("book.num_of_pages")
      .orderBy("book_num_of_read_pages", "DESC")
      .limit(5);

    const result = await query.getMany();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getTopBooks.name}`,
    );
    return result;
  }
}
