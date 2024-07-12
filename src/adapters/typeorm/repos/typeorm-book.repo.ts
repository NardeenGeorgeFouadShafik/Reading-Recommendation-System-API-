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
    const queryBuilder = this.bookRepository
      .createQueryBuilder(EntitiesNamesEnum.Book)
      .addSelect(
        `SUM(DISTINCT ${EntitiesNamesEnum.Reading_Interval}.endPage - ${EntitiesNamesEnum.Reading_Interval}.startPage) AS num_of_read_pages`,
      )
      .leftJoin(
        `${EntitiesNamesEnum.Book}.readingIntervals`,
        EntitiesNamesEnum.Reading_Interval,
      )
      .groupBy(`${EntitiesNamesEnum.Book}.id`)
      .orderBy("num_of_read_pages", "DESC")
      .limit(5);

    const result = await queryBuilder.getRawMany();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getTopBooks.name}`,
    );
    return result;
  }
}
