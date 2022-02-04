import React from 'react'
import { Tweet } from '../generated/graphql'
import { getTimeFromNow } from '../utils/timeUtils'
import profilePicture from '../assets/images/profile-picture.png'
import { Col, Row } from 'react-bootstrap'

interface TweetProps {
  tweet: Tweet
}

export const TweetComponent: React.FC<TweetProps> = ({ tweet }) => {
  return (
    <div className='border-bottom border-light mx-0 mb-2 px-4 py-2 d-flex'>
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
        </div>
    </div>
  )
}
