import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  LOGGING_SERVICE,
  LoggingService,
} from "../../../common/logging/logging.service";
import { UserRepo } from "src/domain/outbound/user.repo";
import { UserEntity } from "../entities/user.entity";
import { User } from "src/domain/models/user.model";
import { EntitiesNamesEnum } from "../entities/database-entities";

@Injectable()
export class TypeORMUserRepo implements UserRepo {
  private readonly LOG_CONTEXT = TypeORMUserRepo.name;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<User>,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
  ) {}

  async findOne(userId: number): Promise<User> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.findOne.name}`);
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.findOne.name}`,
    );
    return user;
  }
  async findOneByEmail(email: string): Promise<User> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.findOne.name}`);
    const user = await this.userRepository.findOne({
      where: { email },
    });
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.findOneByEmail.name}`,
    );
    return user;
  }

  async insert(user: User): Promise<User> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.insert.name}`);
    const result = await this.userRepository.save({
      ...user,
    });
    this.loggingService.debug(this.LOG_CONTEXT, `finished ${this.insert.name}`);
    return result;
  }

  async findAll(usersIds: number[]): Promise<User[]> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.findAll.name}`);
    const query = await this.userRepository.createQueryBuilder(
      EntitiesNamesEnum.User,
    );
    if (usersIds) {
      query.whereInIds(usersIds);
    }
    const result = await query.getMany();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.findAll.name}`,
    );
    return result;
  }
}
