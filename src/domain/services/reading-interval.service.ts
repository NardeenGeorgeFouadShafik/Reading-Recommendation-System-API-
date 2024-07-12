import { ReadingInterval } from "../models/reading-interval.model";

export const READING_INTERVAL_SERVICE = Symbol("READING_INTERVAL_SERVICE");
export interface ReadingIntervalService {
  submitReadingInterval(
    readingInterval: ReadingInterval,
  ): Promise<ReadingInterval>;
  getReadingInterval(readingIntervalId: number): Promise<ReadingInterval>;
  getAllReadingIntervals(
    readingIntervalsIds?: number[],
  ): Promise<ReadingInterval[]>;
}
