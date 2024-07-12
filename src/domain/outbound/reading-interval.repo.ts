import { ReadingInterval } from "../models/reading-interval.model";

export const READING_INTERVAL_REPO = Symbol("READING_INTERVAL_REPO");
export interface ReadingIntervalRepo {
  insert(readingInterval: ReadingInterval): Promise<ReadingInterval>;
  findOne(readingIntervalId: number): Promise<ReadingInterval>;
  findAll(readingIntervalsIds?: number[]): Promise<ReadingInterval[]>;
}
