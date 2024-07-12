import { User } from "../models/user.model";

export const USER_REPO = Symbol("USER_REPO");
export interface UserRepo {
  findOne(userId: number): Promise<User>;

  insert(user: Partial<User>): Promise<User>;

  findAll(usersIds?: number[]): Promise<User[]>;

  findOneByEmail(email: string): Promise<User>;
}
