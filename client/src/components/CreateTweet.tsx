import React, { useState } from 'react'
import { Form, Row, Button } from 'react-bootstrap'
import { TimelineTweetsDocument, useCreateTweetMutation } from '../generated/graphql'
import { FormInputField } from './FormInputField'

export const CreateTweet = () => {
  const [newTweet, setNewTweet] = useState('qweqw')
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
      refetchQueries: [TimelineTweetsDocument]
    })
  }

  return (
    <Form
      className='user-form border-bottom border-light py-3 mb-2'
      onSubmit={createNewTweet}
    >
      <Row className='user-form-row'>
        <Form.Control
          as='textarea'
          type='text'
          id='newTweet'
          value={newTweet}
          onChange={(e) => updateNewTweet(e.target.value)}
        />
      </Row>
      <Button variant='primary' type='submit' className='ml-auto'>
        Submit
      </Button>
    </Form>
  )
}
