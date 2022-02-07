import React, { useState } from 'react'
import { Form, Row, Button } from 'react-bootstrap'
import {
  TimelineTweetsDocument,
  useCreateTweetMutation,
} from '../generated/graphql'
import { FormInputField } from './FormInputField'

export const CreateTweet = () => {
  const [newTweet, setNewTweet] = useState('')
  const [createTweet] = useCreateTweetMutation()

  const updateNewTweet = (updatedTweet: string) => {
    setNewTweet(updatedTweet)
  }
  const createNewTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createTweet({
      variables: {
        textContent: newTweet,
      },
      refetchQueries: [TimelineTweetsDocument],
    })
  }

  return (
    <div className='border-bottom border-light py-3 mb-2 text-end'>
      <Form className='user-form ' onSubmit={createNewTweet}>
        <Form.Control
          as='textarea'
          type='text'
          id='newTweet'
          value={newTweet}
          onChange={(e) => updateNewTweet(e.target.value)}
          placeholder={`What's new?`}
          className='mb-2 textarea'
        />
        <Button variant='primary' type='submit'>
          Tweet
        </Button>
      </Form>
    </div>
  )
}
