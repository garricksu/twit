import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

const Register = () => {
  return (
    <Container className='py-5'>
      <Form className='user-form'>
        <Row className='user-form-row'>
          <Col>
            <Form.Group controlId='formGroupFirstName'>
              <Form.Label>First Name</Form.Label>
              <Form.Control type='text' />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='formGroupLastName'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control type='text' />
            </Form.Group>
          </Col>
        </Row>
        <Row className='user-form-row'>
          <Col>
            <Form.Group controlId='formGroupEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' />
            </Form.Group>
          </Col>
        </Row>
        <Row className='user-form-row'>
          <Col>
            <Form.Group controlId='formGroupUsername'>
              <Form.Label>Username</Form.Label>
              <Form.Control type='text' />
            </Form.Group>
          </Col>
        </Row>
        <Row className='user-form-row'>
          <Col>
            <Form.Group controlId='formGroupEmail'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' />
            </Form.Group>
          </Col>
        </Row>

        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default Register
