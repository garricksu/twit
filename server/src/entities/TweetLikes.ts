import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm'
import { Tweet } from './Tweet'

@ObjectType()
@Entity()
@Unique(['tweetId', 'userId'])
export class TweetLikes extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  tweetId: number

  @Column()
  userId: number

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @ManyToOne(() => Tweet, (tweet) => tweet.likes)
  tweet: Tweet

}
