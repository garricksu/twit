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
  UseMiddleware,
} from 'type-graphql'
import { Brackets } from 'typeorm'
import { Tweet } from '../entities/Tweet'
import { TweetLikes } from '../entities/TweetLikes'
import { isAuth } from '../middleware/isAuth'
import { MyContext } from '../types'

@InputType()
class NewTweetInput {
  @Field()
  textContent: string
}

@ObjectType()
class PaginatedTweets {
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

  @Mutation(() => Boolean)
  async updateLike(
    @Arg('tweetId', () => Int) tweetId: number,
    @Arg('liked') liked: boolean,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    if (liked) {
      await TweetLikes.delete({
        tweetId,
        userId: req.session.userId,
      })
    } else {
      await TweetLikes.insert({
        tweetId,
        userId: req.session.userId,
      })
    }

    return true
  }

  // return all tweets
  @Query(() => PaginatedTweets, { nullable: true })
  @UseMiddleware(isAuth)
  async timelineTweets(
    @Arg('cursor', () => String, { nullable: true }) cursor: string,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedTweets | null> {
    let hasMore = false
    if (!cursor) {
      cursor = new Date().toISOString()
    }
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
      .loadRelationCountAndMap('tweet.likeCount', 'tweet.likes')
      .leftJoin('user.following', 'subscription')
      .where(
        new Brackets((qb) =>
          qb.where('subscription.followerId = :userId OR user.id = :userId', {
            userId: req.session.userId,
          })
        )
      )
      .andWhere(
        new Brackets((qb) => qb.where('tweet.createdAt < :cursor', { cursor }))
      )
      .take(11)
      .orderBy('tweet.createdAt', 'DESC')

    const userTweets = await qb.getMany()
    if (userTweets.length > 10) {
      userTweets.pop()
      hasMore = true
    }

    const likedQb = TweetLikes.createQueryBuilder('likes')
      .select(['"tweetId"'])
      .leftJoin(
        (qb) =>
          qb
            .select(['id', '"createdAt"'])
            .from(Tweet, 'tweets')
            .where('tweets.createdAt < :cursor', { cursor })
            .limit(10)
            .orderBy('"createdAt"', 'DESC'),
        'tweets',
        'likes."tweetId" = tweets.id'
      )
      .where('likes."userId" = :userId AND likes."tweetId" = tweets.id', {
        userId: req.session.userId,
      })

    const liked = await likedQb.getRawMany()
    console.log(liked)

    userTweets.forEach((tweet) => {
      const likeIndex = liked.findIndex((like) => like.tweetId === tweet.id)

      if (likeIndex !== -1) {
        tweet.liked = true
      } else tweet.liked = false
    })

    return { tweets: userTweets, hasMore }
  }
}
