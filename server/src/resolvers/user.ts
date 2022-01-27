import argon2 from 'argon2'
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { getConnection } from 'typeorm'
import { COOKIE_NAME } from '../constants'
import {
  LoginUserInput,
  RegisterUserInput,
  UserProfile,
  UserResponse,
} from '../entities/types/userTypes'
import { User } from '../entities/User'
import { MyContext } from '../types'

@Resolver(UserProfile)
export class UserResolver {
  // return all users
  @Query(() => [UserProfile], { nullable: true })
  async users(): Promise<User[]> {
    const users = await User.find()
    return users
  }

  @Query(() => UserProfile, { nullable: true })
  async user(@Arg('userId', () => Int) userId: number) {
    const user = (await User.findOne(userId)) || null
    return user
  }

  @Query(() => UserProfile, { nullable: true })
  async currentUser(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null
    }
    return await User.findOne(req.session.userId, {
      select: ['id', 'username', 'email', 'firstName', 'lastName'],
    })
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
    console.log('LOGIN')
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

  @Query(() => [UserProfile])
  async followers(@Arg('userId') userId: number): Promise<UserProfile[]> {
    const followers = await User.createQueryBuilder('user')
      .select('user.id, user.username, user.firstName, user.lastName')
      .leftJoin('user.followers', 'subscription')
      .where('subscription.userId = :userId', { userId })
      .getRawMany()
    return followers
  }

  @Query(() => [UserProfile])
  async following(@Arg('userId') userId: number): Promise<UserProfile[]> {
    const followers = await User.createQueryBuilder('user')
      .select('user.id, user.username, user.firstName, user.lastName')
      .leftJoin('user.following', 'subscription')
      .where('subscription.followerId = :userId', { userId })
      .getRawMany()
    return followers
  }
}
