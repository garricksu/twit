import { InMemoryCache, makeVar } from '@apollo/client'

export const currentUser = makeVar([])

export const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['id'],
    },
    
  },
})
