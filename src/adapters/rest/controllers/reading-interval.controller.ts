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
import { ReadingInterval } from "../../../domain/models/reading-interval.model";
import {
  READING_INTERVAL_SERVICE,
  ReadingIntervalService,
} from "src/domain/services/reading-interval.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { SubmitReadingIntervalDto } from "../dtos/submit-reading-interval.dto";

@Controller("api/reading-intervals/")
export class ReadingIntervalController {
  private readonly LOG_CONTEXT = ReadingIntervalController.name;
  constructor(
    @Inject(READING_INTERVAL_SERVICE)
    private readingIntervalService: ReadingIntervalService,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async submitReadingInterval(
    @Body() readingIntervalDto: SubmitReadingIntervalDto,
  ): Promise<ReadingInterval> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.submitReadingInterval.name}`,
    );
    const readingInterval =
      await this.readingIntervalService.submitReadingInterval({
        user: { id: readingIntervalDto.userId },
        book: { id: readingIntervalDto.bookId },
        endPage: readingIntervalDto.endPage,
        startPage: readingIntervalDto.startPage,
      });

    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.submitReadingInterval.name}`,
    );
    return readingInterval;
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  async getReadingInterval(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ReadingInterval> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getReadingInterval.name}`,
    );
    const readingInterval =
      await this.readingIntervalService.getReadingInterval(id);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getReadingInterval.name}`,
    );
    return readingInterval;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllReadingIntervals(): Promise<ReadingInterval[]> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getAllReadingIntervals.name}`,
    );
    const readingIntervals =
      await this.readingIntervalService.getAllReadingIntervals();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getAllReadingIntervals.name}`,
    );
    return readingIntervals;
  }
}
