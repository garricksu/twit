import { User } from '../entities/User'
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import argon2 from 'argon2'
import { MyContext } from '../types'
import { UserInputError, ValidationError } from 'apollo-server-errors'
import { getConnection } from 'typeorm'
import { COOKIE_NAME } from '../constants'

@InputType()
class LoginUserInput {
  @Field()
  emailOrUsername: string

  @Field()
  password: string
}

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
  async user(@Arg('userId', () => Int) userId: number) {
    const user = (await User.findOne(userId)) || null
    return user
  }

  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null
    }
    return User.findOne(req.session.userId)
  }

  @Mutation(() => User)
  async register(
    @Arg('input') newUserData: RegisterUserInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const { firstName, lastName, email, username, password } = newUserData
    const hashedPassword = await argon2.hash(password)
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          { firstName, lastName, email, username, password: hashedPassword },
        ])
        .returning('id, "firstName", "lastName", email, username')
        .execute()

      const user = result.raw[0]
      req.session.userId = user.id
      console.log(user.id)
      console.log(result.raw[0])
      return user
    } catch (err) {
      if (err.code === '23505' && err.detail.includes('email')) {
        throw new ValidationError('An account with this email already exists.')
      } else if (err.code === '23505' && err.detail.includes('username')) {
        throw new ValidationError(
          'This username is not available. Please try again.'
        )
      } else {
        throw new Error('Internal server error')
      }
    }
  }

  @Mutation(() => User)
  async login(
    @Arg('data') loginInput: LoginUserInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const { emailOrUsername, password } = loginInput
    const user = await User.findOne({ where: { email: emailOrUsername } })
    if (!user) {
      throw new UserInputError('Invalid username or password')
    } else if (await argon2.verify(user.password, password)) {
      req.session.userId = user.id
    } else {
      throw new UserInputError('Invalid username or password')
    }

    return user
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          resolve(false)
          return
        }
        resolve(true)
      })
    )
  }
}
