import 'reflect-metadata'
import express from 'express'
import path from 'path'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/user'
import cors from 'cors'

const main = async () => {
  const app = express()

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

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: ({ req }) => {
      req
    },
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('Apollo Server started on localhost:4000')
  })
}

main()
