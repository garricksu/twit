import 'reflect-metadata'
import path from 'path'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/user'

const main = async () => {
  const connection = await createConnection({
    type: 'postgres',
    database: 'twit',
    username: 'garricksu',
    password: '9628FatalGDS',
    logging: true,
    entities: [User],
    migrations: [path.join(__dirname, './migrations/*')],
    synchronize: true,
  })

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
  })

  apolloServer.listen(4000, () => {
    console.log('Apollo Server started on localhost:4000')
  })
}

main()
