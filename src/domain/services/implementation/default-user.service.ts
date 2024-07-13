import { Inject } from "@nestjs/common";
import {
  LOGGING_SERVICE,
  LoggingService,
} from "../../../common/logging/logging.service";
import { User } from "../../models/user.model";
import { UserService } from "../user.service";
import { USER_REPO, UserRepo } from "../../../domain/outbound/user.repo";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ApiBusinessError } from "../../../common/exception-handling/errors/api-business-error.model";
import { BusinessConstraintEnum } from "../../../common/exception-handling/enums/business-constraint.enum";
import { Token } from "../../../domain/models/token.model";
import { ConfigurationEnum } from "../../../common/configuration/configuration.enum";
import { ConfigService } from "@nestjs/config";

export class DefaultUserService implements UserService {
  private readonly LOG_CONTEXT = DefaultUserService.name;

  constructor(
    @Inject(USER_REPO) private userRepo: UserRepo,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getAllUsers(usersIds?: number[]): Promise<User[]> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getAllUsers.name}`,
    );
    const result = await this.userRepo.findAll(usersIds);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getAllUsers.name}`,
    );
    return result;
  }

  async createUser(user: User): Promise<User> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.createUser.name}`,
    );
    user.password = await bcrypt.hash(user.password, 10);
    const savedUser = await this.userRepo.insert(user);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.createUser.name}`,
    );
    const { password, ...insertedUserWithoutPassword } = savedUser;
    return insertedUserWithoutPassword;
  }

  async createFirstAdmins(): Promise<void> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.createFirstAdmins.name}`,
    );
    const admins: string[] = this.configService
      .get<string>(ConfigurationEnum.ADMINS)
      .split(";");
    admins.forEach(async (jsonAdmin) => {
      const admin = JSON.parse(jsonAdmin);
      const savedAdmin = await this.userRepo.findOneByEmail(admin.email);
      if (!savedAdmin) {
        await this.createUser(admin);
      }
    });
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.createFirstAdmins.name}`,
    );
  }

  async getUser(userId: number): Promise<User> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.getUser.name}`);
    const result = await this.userRepo.findOne(userId);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getUser.name}`,
    );
    return result;
  }

  async login(user: Partial<User>): Promise<Token> {
    const registeredUser = await this.userRepo.findOneByEmail(user.email);
    if (
      registeredUser &&
      (await bcrypt.compare(user.password, registeredUser.password))
    ) {
      const payload = {
        email: registeredUser.email,
        sub: registeredUser.id,
        role: registeredUser.role,
        name: registeredUser.name,
      };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new ApiBusinessError(BusinessConstraintEnum.CREDENTIALS_ERROR);
    }
  }
}
