import { User } from '../entities/User'
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import argon2 from 'argon2'
import { MyContext } from '../types'
import { UserInputError } from 'apollo-server-errors'
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

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
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

  @Mutation(() => UserResponse)
  async register(
    @Arg('input') newUserData: RegisterUserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const { firstName, lastName, email, username, password } = newUserData
    const hashedPassword = await argon2.hash(password)
    let user
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

      user = result.raw[0]
      req.session.userId = user.id
    } catch (err) {
      if (err.code === '23505' && err.detail.includes('email')) {
        return {
          errors: [
            {
              field: 'email',
              message: 'An account with this email already exists',
            },
          ],
        }
      } else if (err.code === '23505' && err.detail.includes('username')) {
        return {
          errors: [
            {
              field: 'username',
              message: 'This username is not available',
            },
          ],
        }
      } else {
        return {
          errors: [
            {
              field: '',
              message: 'Interntal server error.',
            },
          ],
        }
      }
    }
    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('input') loginInput: LoginUserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const { emailOrUsername, password } = loginInput
    const user = await User.findOne(
      emailOrUsername.includes('@')
        ? { where: { email: emailOrUsername } }
        : { where: { username: emailOrUsername } }
    )
    if (!user) {
      return {
        errors: [
          {
            field: 'emailOrUsername',
            message: 'Invalid email/username or password',
          },
        ],
      }
    } else if (await argon2.verify(user.password, password)) {
      req.session.userId = user.id
    } else {
      return {
        errors: [
          {
            field: 'emailOrUsername',
            message: 'Invalid email/username or password',
          },
        ],
      }
    }

    return { user }
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
