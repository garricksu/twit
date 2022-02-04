import { InMemoryCache, makeVar } from '@apollo/client'

export const currentUser = makeVar([])

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        timelineTweets: {
          keyArgs: false,
          merge(existing = { tweets: [] }, incoming) {
            if (incoming)
              return {
                tweets: [...existing.tweets, ...incoming.tweets],
                hasMore: incoming.hasMore,
              }
            else
              return {
                tweets: [],
                hasMore: null,
              }
          },
        },
      },
    },
  },
})
