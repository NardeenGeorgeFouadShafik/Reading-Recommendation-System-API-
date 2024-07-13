import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntitiesNamesEnum } from "./database-entities";
import { Book } from "../../../domain/models/book.model";
import { ReadingIntervalEntity } from "./reading-interval.entity";
import { ReadingInterval } from "../../../domain/models/reading-interval.model";

@Entity({ name: EntitiesNamesEnum.Book })
export class BookEntity implements Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  title: string;
  @Column({ type: String })
  author: string;
  @Column({ type: Number })
  numOfPages: number;

  @Column({
    type: Number,
    nullable: true,
    select: false,
    insert: false,
    update: false,
  })
  numOfReadPages: number;

  @OneToMany(
    () => ReadingIntervalEntity,
    (readingInterval) => readingInterval.book,
  )
  readingIntervals: ReadingInterval[];
}
