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
import { RolesEnum } from "../../../domain/models/roles.enum";
import { User, UserClass } from "../../../domain/models/user.model";
import { Token, TokenClass } from "../../../domain/models/token.model";
import { CurrentUser } from "../decorators/current-user.decorator";
import { RolesGuard } from "../guards/roles.guard";
import { USER_SERVICE, UserService } from "src/domain/services/user.service";
import { Roles } from "../decorators/roles.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserCredentialsDto } from "../dtos/user-credentials.dto";

@ApiTags("users")
@ApiBearerAuth()
@ApiExtraModels(UserClass, TokenClass) // Register the classes for Swagger
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
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully created.",
    type: UserClass,
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
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
  @ApiOperation({ summary: "User login" })
  @ApiResponse({
    status: 200,
    description: "Successfully logged in.",
    type: TokenClass,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async login(@Body() userCredentialsDto: UserCredentialsDto): Promise<Token> {
    this.loggingService.debug(this.LOG_CONTEXT, `started ${this.login.name}`);
    const token = await this.userService.login({ ...userCredentialsDto });
    this.loggingService.debug(this.LOG_CONTEXT, `finished ${this.login.name}`);
    return token;
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ROLE_ADMIN)
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiParam({
    name: "id",
    required: true,
    description: "ID of the user",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Return the user.",
    type: UserClass,
  })
  @ApiResponse({ status: 404, description: "User not found." })
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
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({
    status: 200,
    description: "Return all users.",
    type: [UserClass],
  })
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
