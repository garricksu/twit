import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryColumn,
  Unique
} from 'typeorm'
import { User } from './User'

@ObjectType()
@Entity()
@Unique(['userId', 'followerId'])
export class Subscription extends BaseEntity {
  @Field()
  @PrimaryColumn({name: 'userId'})
  userId: number

  @Field()
  @PrimaryColumn({name: 'followerId'})
  followerId: number

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.following, { primary: true, cascade: true })
  user: User

  @ManyToOne(() => User, (user) => user.followers, { primary: true, cascade: true })
  follower: User
}
