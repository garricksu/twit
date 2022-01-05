import React from 'react'
import { Alert } from 'react-bootstrap'
import { FieldError } from '../generated/graphql'

export const Errors = (errors: FieldError[]) => {
  errors.map((error) => {
    return <Alert>{error.message}</Alert>
  })
}
