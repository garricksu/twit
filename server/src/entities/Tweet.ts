import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
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
}
