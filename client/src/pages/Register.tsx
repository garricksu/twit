import { from } from '@apollo/client'
import { Field, Formik, useField } from 'formik'
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import {
  RegisterUserInput,
  useRegisterUserMutation,
} from '../generated/graphql'

const Register = () => {
  // const MyTextInput = ({ label: string, ...props }) => {
  //   // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  //   // which we can spread on <input>. We can use field meta to show an error
  //   // message if the field is invalid and it has been touched (i.e. visited)
  //   const [field, meta] = useField(props)
  //   return (
  //     <>
  //       <label htmlFor={props.id || props.name}>{label}</label>
  //       <input className='text-input' {...field} {...props} />
  //       {meta.touched && meta.error ? (
  //         <div className='error'>{meta.error}</div>
  //       ) : null}
  //     </>
  //   )
  // }

  const [register] = useRegisterUserMutation()

  const submitUserForm = async (userInput: RegisterUserInput) => {
    await register({ variables: { input: userInput } })
  }

  return (
    <Container className='py-5'>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
        }}
        onSubmit={(values) => submitUserForm(values)}
      >
        {(formik) => (
          <Form className='user-form' onSubmit={formik.handleSubmit}>
            <Row className='user-form-row'>
              <Col>
                <Form.Label htmlFor='firstName' className='fw-bold'>
                  First Name
                </Form.Label>
                <Form.Control
                  type='text'
                  name='firstName'
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                />
              </Col>
              <Col>
                <Form.Label htmlFor='lastName' className='fw-bold'>
                  Last Name
                </Form.Label>
                <Form.Control
                  type='text'
                  name='lastName'
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
              </Col>
            </Row>
            <Row className='user-form-row'>
              <Col>
                <Form.Label htmlFor='email' className='fw-bold'>
                  Email
                </Form.Label>
                <Form.Control
                  type='email'
                  name='email'
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </Col>
            </Row>
            <Row className='user-form-row'>
              <Col>
                <Form.Label htmlFor='username' className='fw-bold'>
                  Username
                </Form.Label>
                <Form.Control
                  type='text'
                  name='username'
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
              </Col>
            </Row>
            <Row className='user-form-row'>
              <Col>
                <Form.Label htmlFor='password' className='fw-bold'>
                  Password
                </Form.Label>
                <Form.Control
                  type='password'
                  name='password'
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </Col>
            </Row>

            <Button variant='primary' type='submit'>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default Register
