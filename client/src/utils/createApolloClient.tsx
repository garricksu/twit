import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

const link = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
})

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          cartItems: {
            read() {},
          },
        },
      },
    },
  }),
})
