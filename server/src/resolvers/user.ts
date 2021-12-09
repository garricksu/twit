import { User } from "../entities/User";
import { Query, Resolver } from "type-graphql";

@Resolver(User)
export class UserResolver {
  // return all users
  @Query(() => [User], {nullable: true})
  async users(): Promise<User[]> {
    const users = await User.find()
    return users
  }

}