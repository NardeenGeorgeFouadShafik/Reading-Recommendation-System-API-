import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ForeignKeyConstraintEnum } from "../../../common/exception-handling/enums/foreign-key-constraint.enum";
import { User } from "../../../domain/models/user.model";
import { EntitiesNamesEnum } from "./database-entities";
import { Book } from "../../../domain/models/book.model";
import { ReadingInterval } from "../../../domain/models/reading-interval.model";
import { UserEntity } from "./user.entity";
import { BookEntity } from "./book.entity";

@Entity({ name: EntitiesNamesEnum.Reading_Interval })
export class ReadingIntervalEntity implements ReadingInterval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: Number })
  startPage: number;

  @Column({ type: Number })
  endPage: number;

  @ManyToOne(() => BookEntity, (book) => book.readingIntervals)
  @JoinColumn({
    foreignKeyConstraintName:
      ForeignKeyConstraintEnum.FK_READINGINTERVAL_BOOK_BOOKID,
  })
  book: Book;

  @ManyToOne(() => UserEntity, (user) => user.readingIntervals)
  @JoinColumn({
    foreignKeyConstraintName:
      ForeignKeyConstraintEnum.FK_READINGINTERVAL_USER_USERID,
  })
  user: User;
}
