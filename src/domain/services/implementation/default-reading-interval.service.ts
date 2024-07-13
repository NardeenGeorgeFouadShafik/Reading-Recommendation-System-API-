import { Inject } from "@nestjs/common";
import {
  LOGGING_SERVICE,
  LoggingService,
} from "../../../common/logging/logging.service";
import { ReadingInterval } from "../../models/reading-interval.model";
import { ReadingIntervalService } from "../reading-interval.service";
import {
  READING_INTERVAL_REPO,
  ReadingIntervalRepo,
} from "../../../domain/outbound/reading-interval.repo";

export class DefaultReadingIntervalService implements ReadingIntervalService {
  private readonly LOG_CONTEXT = DefaultReadingIntervalService.name;

  constructor(
    @Inject(READING_INTERVAL_REPO)
    private readingIntervalRepo: ReadingIntervalRepo,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
  ) {}

  async getAllReadingIntervals(
    readingIntervalsIds?: number[],
  ): Promise<ReadingInterval[]> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getAllReadingIntervals.name}`,
    );
    const result = await this.readingIntervalRepo.findAll(readingIntervalsIds);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getAllReadingIntervals.name}`,
    );
    return result;
  }

  async submitReadingInterval(
    readingInterval: ReadingInterval,
  ): Promise<ReadingInterval> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.submitReadingInterval.name}`,
    );
    const savedReadingInterval =
      await this.readingIntervalRepo.insert(readingInterval);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.submitReadingInterval.name}`,
    );
    return savedReadingInterval;
  }

  async getReadingInterval(
    readingIntervalId: number,
  ): Promise<ReadingInterval> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getReadingInterval.name}`,
    );
    const result = await this.readingIntervalRepo.findOne(readingIntervalId);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getReadingInterval.name}`,
    );
    return result;
  }
}
