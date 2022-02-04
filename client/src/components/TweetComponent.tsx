import React from 'react'
import { Tweet } from '../generated/graphql'
import { getTimeFromNow } from '../utils/timeUtils'

interface TweetProps {
  tweet: Tweet
}

export const TweetComponent: React.FC<TweetProps> = ({ tweet }) => {
  return (
    <div className='border-bottom border-light mb-2'>
      <p>
        {tweet.user.firstName} @{tweet.user.username} |{' '}
        {getTimeFromNow(tweet.createdAt)}
      </p>
      <p>{tweet.textContent}</p>
    </div>
  )
}
