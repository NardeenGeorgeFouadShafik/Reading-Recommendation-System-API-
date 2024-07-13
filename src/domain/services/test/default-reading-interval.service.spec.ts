import { Test, TestingModule } from "@nestjs/testing";
import { DefaultReadingIntervalService } from "../implementation/default-reading-interval.service";
import { ReadingInterval } from "../../models/reading-interval.model";
import {
  READING_INTERVAL_REPO,
  ReadingIntervalRepo,
} from "../../outbound/reading-interval.repo";
import { LocalLoggingService } from "../../../common/logging/local-logging.service";
import { ConfigService } from "@nestjs/config";
import { LOGGING_SERVICE } from "../../../common/logging/logging.service";
import { ClsService } from "nestjs-cls";
import { User } from "../../models/user.model";
import { Book } from "../../models/book.model";

describe("DefaultReadingIntervalService", () => {
  let readingIntervalService: DefaultReadingIntervalService;
  let readingIntervalRepo: ReadingIntervalRepo;
  let loggingService: LocalLoggingService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: READING_INTERVAL_REPO,
          useClass: class {
            insert = jest.fn();
            findAll = jest.fn();
            findOne = jest.fn();
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
        DefaultReadingIntervalService,
      ],
    }).compile();

    readingIntervalService = moduleRef.get<DefaultReadingIntervalService>(
      DefaultReadingIntervalService,
    );
    readingIntervalRepo = moduleRef.get<ReadingIntervalRepo>(
      READING_INTERVAL_REPO,
    );
    loggingService = moduleRef.get<LocalLoggingService>(LOGGING_SERVICE);
  });

  it("should be defined", () => {
    expect(readingIntervalService).toBeDefined();
  });

  describe("getAllReadingIntervals", () => {
    it("should return all reading intervals", async () => {
      const intervals: ReadingInterval[] = [
        {
          id: 1,
          startPage: 1,
          endPage: 10,
          user: { id: 1, email: "user1@example.com" },
          book: { id: 1, title: "Book 1" },
        },
        {
          id: 2,
          startPage: 11,
          endPage: 20,
          user: { id: 2, email: "user2@example.com" },
          book: { id: 2, title: "Book 2" },
        },
      ];

      jest
        .spyOn(readingIntervalRepo, "findAll")
        .mockResolvedValueOnce(intervals);
      jest.spyOn(loggingService, "debug");

      const result = await readingIntervalService.getAllReadingIntervals();
      expect(result).toEqual(intervals);

      expect(readingIntervalRepo.findAll).toHaveBeenCalledTimes(1);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultReadingIntervalService.name,
        "started getAllReadingIntervals",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultReadingIntervalService.name,
        "finished getAllReadingIntervals",
      );
    });
  });

  describe("submitReadingInterval", () => {
    it("should submit a reading interval", async () => {
      const interval: ReadingInterval = {
        id: 1,
        startPage: 1,
        endPage: 10,
        user: { id: 1, email: "user1@example.com" },
        book: { id: 1, title: "Book 1" },
      };
      const savedInterval = { ...interval };

      jest
        .spyOn(readingIntervalRepo, "insert")
        .mockResolvedValueOnce(savedInterval);
      jest.spyOn(loggingService, "debug");

      const result =
        await readingIntervalService.submitReadingInterval(interval);
      expect(result).toEqual(savedInterval);

      expect(readingIntervalRepo.insert).toHaveBeenCalledWith(interval);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultReadingIntervalService.name,
        "started submitReadingInterval",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultReadingIntervalService.name,
        "finished submitReadingInterval",
      );
    });
  });

  describe("getReadingInterval", () => {
    it("should return a reading interval by ID", async () => {
      const interval: ReadingInterval = {
        id: 1,
        startPage: 1,
        endPage: 10,
        user: { id: 1, email: "user1@example.com" },
        book: { id: 1, title: "Book 1" },
      };

      jest
        .spyOn(readingIntervalRepo, "findOne")
        .mockResolvedValueOnce(interval);
      jest.spyOn(loggingService, "debug");

      const result = await readingIntervalService.getReadingInterval(1);
      expect(result).toEqual(interval);

      expect(readingIntervalRepo.findOne).toHaveBeenCalledWith(1);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultReadingIntervalService.name,
        "started getReadingInterval",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultReadingIntervalService.name,
        "finished getReadingInterval",
      );
    });
  });
});
