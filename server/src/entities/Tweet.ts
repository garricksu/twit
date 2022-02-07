import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { TweetLikes } from './TweetLikes'
import { UserProfile } from './types/userTypes'
import { User } from './User'

@ObjectType()
@Entity()
export class Tweet extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Field()
  @Column()
  textContent: string

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @Field(() => UserProfile)
  @ManyToOne(() => User, (user) => user.tweets)
  user: UserProfile

  @Field(()=> [TweetLikes], {nullable: true})
  @OneToMany(() => TweetLikes, like => like.tweet)
  likes: TweetLikes[]

  @Field()
  likeCount: number

  @Field()
  liked: boolean
}
