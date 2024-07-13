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
  ApiExtraModels,
} from "@nestjs/swagger";
import {
  LOGGING_SERVICE,
  LoggingService,
} from "../../../common/logging/logging.service";
import {
  ReadingInterval,
  ReadingIntervalClass,
} from "../../../domain/models/reading-interval.model";
import {
  READING_INTERVAL_SERVICE,
  ReadingIntervalService,
} from "src/domain/services/reading-interval.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { SubmitReadingIntervalDto } from "../dtos/submit-reading-interval.dto";

@ApiTags("reading-intervals")
@ApiBearerAuth()
@ApiExtraModels(ReadingIntervalClass) // Register the class for Swagger
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
  @ApiOperation({ summary: "Submit a new reading interval" })
  @ApiResponse({
    status: 201,
    description: "The reading interval has been successfully submitted.",
    type: ReadingIntervalClass,
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
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
  @ApiOperation({ summary: "Get a reading interval by ID" })
  @ApiParam({
    name: "id",
    required: true,
    description: "ID of the reading interval",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Return the reading interval.",
    type: ReadingIntervalClass,
  })
  @ApiResponse({ status: 404, description: "Reading interval not found." })
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
  @ApiOperation({ summary: "Get all reading intervals" })
  @ApiResponse({
    status: 200,
    description: "Return all reading intervals.",
    type: [ReadingIntervalClass],
  })
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
