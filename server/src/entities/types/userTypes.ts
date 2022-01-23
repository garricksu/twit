import { InputType, Field, ObjectType } from "type-graphql"
import { User } from "../User"

@InputType()
export class LoginUserInput {
  @Field()
  emailOrUsername: string

  @Field()
  password: string
}

@InputType()
export class RegisterUserInput implements Partial<User> {
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
export class UserProfile implements Partial<User> {
  @Field()
  id: number

  @Field()
  email: string

  @Field()
  username: string

  @Field()
  firstName: string

  @Field()
  lastName: string
}

@ObjectType()
export class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => UserProfile, { nullable: true })
  user?: UserProfile
}
