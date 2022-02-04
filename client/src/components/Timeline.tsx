import { Button, Spinner } from 'react-bootstrap'
import {
  TimelineTweetsDocument,
  useTimelineTweetsQuery,
} from '../generated/graphql'
import { client } from '../utils/createApolloClient'
import { TweetComponent } from './TweetComponent'

export const Timeline = () => {
  const { data, loading, fetchMore } = useTimelineTweetsQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { cursor: null },
  })

  const getCursor = () => {
    const currTweets = client.readQuery({ query: TimelineTweetsDocument })
    const lastTweetIndex = currTweets?.timelineTweets.tweets.length - 1
    return currTweets?.timelineTweets.tweets[lastTweetIndex].createdAt
  }

  return (
    <>
      {!loading && data?.timelineTweets?.tweets ? (
        <>
          {data?.timelineTweets?.tweets.map((tweet) => {
            return <TweetComponent tweet={tweet} key={tweet.id} />
          })}
          {data?.timelineTweets?.hasMore ? (
            <Button
              onClick={() => fetchMore({ variables: { cursor: getCursor() } })}
            >
              Load More Tweets
            </Button>
          ) : null}
        </>
      ) : (
        <Spinner animation='border' variant='light' />
      )}
    </>
  )
}
