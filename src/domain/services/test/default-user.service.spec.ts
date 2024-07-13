import { Test, TestingModule } from "@nestjs/testing";
import { DefaultUserService } from "../implementation/default-user.service";
import { User } from "../../models/user.model";
import { USER_REPO, UserRepo } from "../../outbound/user.repo";
import { LocalLoggingService } from "../../../common/logging/local-logging.service";
import { ConfigService } from "@nestjs/config";
import { LOGGING_SERVICE } from "../../../common/logging/logging.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ApiBusinessError } from "../../../common/exception-handling/errors/api-business-error.model";
import { Token } from "../../../domain/models/token.model";
import { RolesEnum } from "../../../domain/models/roles.enum";
import { ClsService } from "nestjs-cls";
import { BusinessConstraintEnum } from "../../../common/exception-handling/enums/business-constraint.enum";

describe("DefaultUserService", () => {
  let userService: DefaultUserService;
  let userRepo: UserRepo;
  let loggingService: LocalLoggingService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: USER_REPO,
          useClass: class {
            insert = jest.fn();
            findAll = jest.fn();
            findOne = jest.fn();
            findOneByEmail = jest.fn();
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest
              .fn()
              .mockReturnValue(
                '{"email": "admin@example.com", "password": "admin"}',
              ),
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
        {
          provide: JwtService,
          useClass: class {
            sign = jest.fn();
          },
        },
        DefaultUserService,
      ],
    }).compile();

    userService = moduleRef.get<DefaultUserService>(DefaultUserService);
    userRepo = moduleRef.get<UserRepo>(USER_REPO);
    loggingService = moduleRef.get<LocalLoggingService>(LOGGING_SERVICE);
    configService = moduleRef.get<ConfigService>(ConfigService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users: User[] = [
        {
          id: 1,
          email: "user1@example.com",
          password: "password1",
          name: "user1",
          role: RolesEnum.ROLE_USER,
        },
        {
          id: 2,
          email: "user2@example.com",
          password: "password2",
          name: "user2",
          role: RolesEnum.ROLE_USER,
        },
      ];

      jest.spyOn(userRepo, "findAll").mockResolvedValueOnce(users);
      jest.spyOn(loggingService, "debug");

      const result = await userService.getAllUsers();
      expect(result).toEqual(users);

      expect(userRepo.findAll).toHaveBeenCalledTimes(1);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultUserService.name,
        "started getAllUsers",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultUserService.name,
        "finished getAllUsers",
      );
    });
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const user: User = {
        email: "user@example.com",
        password: "password",
        name: "user1",
        role: RolesEnum.ROLE_USER,
      };
      const hashedPassword =
        "$2b$10$16y8MPVcmLIiiWkUPDuiju8lyCcEZfe5HAXY7A1tnAMkhh1x.Ukru";
      const savedUser = { ...user, password: hashedPassword, id: 1 };

      jest.spyOn(bcrypt, "hash").mockResolvedValueOnce(hashedPassword);
      jest.spyOn(userRepo, "insert").mockResolvedValueOnce(savedUser);
      jest.spyOn(loggingService, "debug");

      const result = await userService.createUser(user);
      expect(result).toEqual({
        id: 1,
        email: "user@example.com",
        name: "user1",
        role: RolesEnum.ROLE_USER,
      });

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(userRepo.insert).toHaveBeenCalledWith({
        ...user,
        password: hashedPassword,
      });
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultUserService.name,
        "started createUser",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultUserService.name,
        "finished createUser",
      );
    });
  });

  describe("createFirstAdmins", () => {
    it("should create first admins", async () => {
      jest.spyOn(userRepo, "findOneByEmail").mockResolvedValueOnce(null);
      jest
        .spyOn(userService, "createUser")
        .mockResolvedValueOnce({ id: 1, email: "admin@example.com" } as User);
      jest.spyOn(loggingService, "debug");

      await userService.createFirstAdmins();

      expect(userRepo.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultUserService.name,
        "started createFirstAdmins",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultUserService.name,
        "finished createFirstAdmins",
      );
    });
  });

  describe("getUser", () => {
    it("should return a user by ID", async () => {
      const user: User = {
        id: 1,
        email: "user@example.com",
        password: "password",
        name: "user1",
        role: RolesEnum.ROLE_USER,
      };

      jest.spyOn(userRepo, "findOne").mockResolvedValueOnce(user);
      jest.spyOn(loggingService, "debug");

      const result = await userService.getUser(1);
      expect(result).toEqual(user);

      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultUserService.name,
        "started getUser",
      );
      expect(loggingService.debug).toHaveBeenCalledWith(
        DefaultUserService.name,
        "finished getUser",
      );
    });
  });

  describe("login", () => {
    it("should return a token for valid credentials", async () => {
      const user: User = {
        id: 1,
        email: "user@example.com",
        password: "password",
        name: "user1",
        role: RolesEnum.ROLE_USER,
      };
      const token: Token = { accessToken: "token" };

      jest.spyOn(userRepo, "findOneByEmail").mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);
      jest.spyOn(jwtService, "sign").mockReturnValueOnce("token");

      const result = await userService.login({
        email: "user@example.com",
        password: "password",
      });
      expect(result).toEqual(token);

      expect(userRepo.findOneByEmail).toHaveBeenCalledWith("user@example.com");
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
        role: user.role,
        name: user.name,
      });
    });

    it("should throw an error for invalid credentials", async () => {
      const user: User = {
        id: 1,
        email: "user@example.com",
        password: "password",
        name: "user1",
        role: RolesEnum.ROLE_USER,
      };

      jest.spyOn(userRepo, "findOneByEmail").mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);

      try {
        await userService.login({
          email: "user@example.com",
          password: "invalid",
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ApiBusinessError);
        expect(error.constraint).toEqual(
          BusinessConstraintEnum.CREDENTIALS_ERROR,
        );
        expect(error.messageKey).toEqual("CREDENTIALS_ERROR_VIOLATION");
      }

      expect(userRepo.findOneByEmail).toHaveBeenCalledWith("user@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("invalid", user.password);
    });
  });
});
