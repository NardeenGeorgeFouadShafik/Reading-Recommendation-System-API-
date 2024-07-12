import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { UniqueKeyConstraintEnum } from "../../../common/exception-handling/enums/unique-key-constraint.enum";
import { User } from "../../../domain/models/user.model";
import {
  EntitiesNamesEnum,
  EntityUniqueColumnNamesEnum,
} from "./database-entities";
import { ReadingInterval } from "../../../domain/models/reading-interval.model";
import { ReadingIntervalEntity } from "./reading-interval.entity";
import * as bcrypt from "bcrypt";
import { RolesEnum } from "../../../domain/models/roles.enum";

@Entity({ name: EntitiesNamesEnum.User })
@Unique(UniqueKeyConstraintEnum.UQ_USER_EMAIL, [
  EntityUniqueColumnNamesEnum.EMAIL,
])
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @Column({ type: String })
  email: string;

  @Column({ type: String })
  password: string;

  @Column({ type: "enum", enum: RolesEnum })
  role: RolesEnum;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @OneToMany(
    () => ReadingIntervalEntity,
    (readingInterval) => readingInterval.user,
  )
  readingIntervals: ReadingInterval[];
}
