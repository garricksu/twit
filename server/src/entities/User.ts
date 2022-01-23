import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity, Column,
  CreateDateColumn, Entity,
  OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm'
import { Subscription } from './Subscription'
import { Tweet } from './Tweet'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ unique: true })
  email: string

  @Field()
  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Tweet, (tweet) => tweet.user)
  tweets: Tweet[]

  @OneToMany(() => Subscription, subscription => subscription.user )
  following: Subscription[]

  @OneToMany(() => Subscription, subscription => subscription.follower)
  followers: Subscription[]
}
