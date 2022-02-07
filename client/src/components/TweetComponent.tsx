import React from 'react'
import { Button } from 'react-bootstrap'
import profilePicture from '../assets/images/profile-picture.png'
import {
  TimelineTweetsDocument,
  TimelineTweetsQuery,
  Tweet,
  useUpdateLikeMutation
} from '../generated/graphql'
import { client } from '../utils/createApolloClient'
import { getTimeFromNow } from '../utils/timeUtils'

interface TweetProps {
  tweet: Tweet
}

export const TweetComponent: React.FC<TweetProps> = ({ tweet }) => {
  const [updateLike] = useUpdateLikeMutation()

  const updateLikeStatus = async () => {
    client.cache.updateQuery<TimelineTweetsQuery>(
      { query: TimelineTweetsDocument },
      (data) => ({
        timelineTweets: {
          tweets: data?.timelineTweets?.tweets?.map((currentTweet) => {
            if (currentTweet.id === tweet.id && currentTweet.liked) {
              const updatedTweet = {
                ...tweet,
                liked: false,
                likeCount: tweet.likeCount - 1,
              }
              return {
                ...updatedTweet,
              }
            } else if (currentTweet.id === tweet.id && !currentTweet.liked) {
              const updatedTweet = {
                ...tweet,
                liked: true,
                likeCount: tweet.likeCount + 1,
              }
              return {
                ...updatedTweet,
              }
            }

            return { ...currentTweet }
          }),
          hasMore: data?.timelineTweets?.hasMore
            ? data?.timelineTweets.hasMore
            : false,
        },
      })
    )
    await updateLike({
      variables: {
        tweetId: tweet.id,
        liked: tweet.liked,
      },
    })
  }

  return (
    <div className='border-bottom border-light mx-0 mb-2 px-5 py-3 d-flex'>
      <img
        src={profilePicture}
        alt='profile picture'
        className='tweet-profile-picture'
      />
      <div>
        <ul className='list-inline'>
          <li className='list-inline-item fw-bold'>{tweet.user.firstName}</li>
          <li className='list-inline-item text-secondary'>
            @{tweet.user.username}
          </li>
          <li className='list-inline-item text-secondary'>
            {getTimeFromNow(tweet.createdAt)}
          </li>
        </ul>
        <p>{tweet.textContent}</p>
        <ul className='list-inline'>
          <li className='list-inline-item'>
            <Button className='tweet-like' onClick={updateLikeStatus}>
              <i
                className={`bi ${
                  tweet.liked ? 'bi-heart-fill text-danger' : 'bi-heart'
                }`}
              ></i>
            </Button>
          </li>
          <li className='list-inline-item text-secondary'>{tweet.likeCount}</li>
        </ul>
      </div>
    </div>
  )
}
