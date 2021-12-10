import { User } from '../entities/User'
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'

@InputType()
class RegisterUserInput implements Partial<User> {
  @Field()
  email: string

  @Field()
  username: string

  @Field()
  password: string

  @Field()
  firstName: string

  @Field()
  lastName: string
}

@Resolver(User)
export class UserResolver {
  // return all users
  @Query(() => [User], { nullable: true })
  async users(): Promise<User[]> {
    const users = await User.find()
    return users
  }

  @Query(() => User, { nullable: true })
  async user(@Arg('userId', () => Int) userId: number): Promise<User | null> {
    const user = (await User.findOne(userId)) || null
    return user
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('data') newUserData: RegisterUserInput
  ): Promise<Boolean> {
    await User.insert(newUserData)
    return true
  }
}
