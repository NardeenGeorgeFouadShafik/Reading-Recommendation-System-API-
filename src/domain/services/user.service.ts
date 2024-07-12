import { Token } from "../models/token.model";
import { User } from "../models/user.model";

export const USER_SERVICE = Symbol("USER_SERVICE");
export interface UserService {
  login(user: Partial<User>): Promise<Token>;

  getUser(userId: number): Promise<User>;

  createUser(user: Partial<User>): Promise<User>;

  getAllUsers(usersIds?: number[]): Promise<User[]>;
}
