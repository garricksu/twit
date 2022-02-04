import { isAuth } from '../middleware/isAuth'
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { Brackets } from 'typeorm'
import { Tweet } from '../entities/Tweet'
import { MyContext } from '../types'
import { UserProfile } from '../entities/types/userTypes'
import { User } from '../entities/User'

@InputType()
class NewTweetInput {
  @Field()
  textContent: string
}

@ObjectType()
class paginatedTweets {
  @Field(() => [Tweet], { nullable: true })
  tweets: Tweet[]

  @Field()
  hasMore: boolean
}

@Resolver(Tweet)
export class TweetResolver {
  // return all Tweets
  @Query(() => [Tweet], { nullable: true })
  async tweets(): Promise<Tweet[]> {
    const tweets = await Tweet.find()
    return tweets
  }

  @Query(() => [Tweet], { nullable: true })
  async userTweets(@Arg('userId') userId: number): Promise<Tweet[]> {
    const userTweets = await Tweet.find({ where: { userId } })
    return userTweets
  }

  @Mutation(() => Tweet)
  async createTweet(
    @Arg('input') newTweetData: NewTweetInput,
    @Ctx() { req }: MyContext
  ): Promise<Tweet> {
    const { textContent } = newTweetData

    return await Tweet.create({
      textContent,
      userId: req.session.userId,
    }).save()
  }

  // return all tweets
  @Query(() => paginatedTweets, { nullable: true })
  @UseMiddleware(isAuth)
  async timelineTweets(
    @Arg('cursor', () => String, { nullable: true }) cursor: string,
    @Ctx() { req }: MyContext
  ): Promise<paginatedTweets | null> {
    let hasMore = false

    const qb = Tweet.createQueryBuilder('tweet')
      .select([
        'tweet.id',
        'tweet.textContent',
        'tweet.createdAt',
        'user.id',
        'user.username',
        'user.firstName',
        'user.lastName',
        'user.email',
      ])
      .leftJoin('tweet.user', 'user')
      .where('tweet.userId = :userId', { userId: req.session.userId })
      .leftJoin('user.following', 'subscription')
      .where(
        new Brackets((qb) =>
          qb.where('subscription.followerId = :userId OR user.id = :userId', {
            userId: req.session.userId,
          })
        )
      )
      .take(11)
      .orderBy('tweet.createdAt', 'DESC')
    cursor
      ? qb.andWhere(
          new Brackets((qb) =>
            qb.where('tweet.createdAt < :cursor', { cursor })
          )
        )
      : null

    const userTweets = await qb.getMany()
    if (userTweets.length > 10) {
      userTweets.pop()
      hasMore = true
    }
    console.log(userTweets)
    return { tweets: userTweets, hasMore }
  }
}
