import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation, Query,
  Resolver
} from 'type-graphql'
import { Tweet } from '../entities/Tweet'
import { MyContext } from '../types'

@InputType()
class NewTweetInput {
  @Field()
  textContent: string
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
  @Query(() => [Tweet])
  async timelineTweets(@Ctx() { req }: MyContext): Promise<Tweet[]> {
    const currentUserID = req.session.userId
    const userTweets = await Tweet.createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.user', 'user')
      .where('tweet.userId = :userId', { userId: currentUserID })
      .leftJoin('user.following', 'subscription')
      .where('subscription.followerId = :userId OR user.id = :userId', {
        userId: currentUserID,
      })
      .orderBy('tweet.createdAt', 'DESC')
      .getMany()

    return userTweets
  }
}
