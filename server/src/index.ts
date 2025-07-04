import 'reflect-metadata'
import express from 'express'
import path from 'path'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/user'
import cors from 'cors'
import connectRedis from 'connect-redis'
import session from 'express-session'
import Redis from 'ioredis'
import { COOKIE_NAME, __prod__ } from './constants'

const main = async () => {
  const app = express()

  const connection = await createConnection({
    type: 'postgres',
    database: 'twit',
    username: '...',
    password: '...',
    logging: true,
    entities: [User],
    migrations: [path.join(__dirname, './migrations/*')],
    synchronize: true,
  })

  const RedisStore = connectRedis(session)
  const redis = new Redis()

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'camithepirate',
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => {
    console.log('Apollo Server started on localhost:4000')
  })
}

main()
