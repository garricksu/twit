import { useTimelineTweetsQuery } from '../generated/graphql'
import { TweetComponent } from './TweetComponent'

export const Timeline = () => {
  const { data, loading } = useTimelineTweetsQuery({
    fetchPolicy: 'network-only'
  })
  return (
    <>
      {!loading && data
        ? data?.timelineTweets?.map((tweet) => {
            return <TweetComponent tweet={tweet} key={tweet.id} />
          })
        : null}
    </>
  )
}
