import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  LOGGING_SERVICE,
  LoggingService,
} from "../../../common/logging/logging.service";
import { ReadingIntervalRepo } from "src/domain/outbound/reading-interval.repo";
import { ReadingIntervalEntity } from "../entities/reading-interval.entity";
import { ReadingInterval } from "src/domain/models/reading-interval.model";
import { EntitiesNamesEnum } from "../entities/database-entities";

@Injectable()
export class TypeORMReadingIntervalRepo implements ReadingIntervalRepo {
  private readonly LOG_CONTEXT = TypeORMReadingIntervalRepo.name;

  constructor(
    @InjectRepository(ReadingIntervalEntity)
    private readingIntervalRepository: Repository<ReadingInterval>,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
  ) {}

  async findOne(readingIntervalId: number): Promise<ReadingInterval> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.findOne.name}`);
    const readingInterval = await this.readingIntervalRepository.findOne({
      where: { id: readingIntervalId },
    });
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.findOne.name}`,
    );
    return readingInterval;
  }

  async insert(readingInterval: ReadingInterval): Promise<ReadingInterval> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.insert.name}`);
    const result = await this.readingIntervalRepository.save({
      ...readingInterval,
    });
    this.loggingService.debug(this.LOG_CONTEXT, `finished ${this.insert.name}`);
    return result;
  }

  async findAll(readingIntervalsIds: number[]): Promise<ReadingInterval[]> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.findAll.name}`);
    const query = await this.readingIntervalRepository.createQueryBuilder(
      EntitiesNamesEnum.Reading_Interval,
    );
    if (readingIntervalsIds) {
      query.whereInIds(readingIntervalsIds);
    }
    const result = await query.getMany();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.findAll.name}`,
    );
    return result;
  }
}
