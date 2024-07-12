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
import { RolesEnum } from "../../../domain/models/roles.enum";
import { User } from "../../../domain/models/user.model";
import { CurrentUser } from "../decorators/current-user.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { Operator } from "rxjs";
import { USER_SERVICE, UserService } from "src/domain/services/user.service";
import { Roles } from "../decorators/roles.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserCredentialsDto } from "../dtos/user-credentials.dto";
import { Token } from "src/domain/models/token.model";

@Controller("api/users/")
export class UserController {
  private readonly LOG_CONTEXT = UserController.name;
  constructor(
    @Inject(USER_SERVICE) private userService: UserService,
    @Inject(LOGGING_SERVICE) private loggingService: LoggingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ROLE_ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.createUser.name}`,
    );
    const user = await this.userService.createUser({ ...createUserDto });

    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.createUser.name}`,
    );
    return user;
  }

  @Post("/login")
  async login(@Body() userCredentialsDto: UserCredentialsDto): Promise<Token> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.login.name}`);
    const token = await this.userService.login({ ...userCredentialsDto });

    this.loggingService.debug(this.LOG_CONTEXT, `finished ${this.login.name}`);
    return token;
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ROLE_ADMIN)
  async getUser(@Param("id", ParseIntPipe) id: number): Promise<User> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.getUser.name}`);
    const user = await this.userService.getUser(id);
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getUser.name}`,
    );
    return user;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ROLE_ADMIN)
  async getAllUsers(): Promise<User[]> {
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `started ${this.getAllUsers.name}`,
    );
    const users = await this.userService.getAllUsers();
    this.loggingService.debug(
      this.LOG_CONTEXT,
      `finished ${this.getAllUsers.name}`,
    );
    return users;
  }
}
