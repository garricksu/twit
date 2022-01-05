import { Formik } from 'formik'
import { Button, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { FormInputField } from '../components/FormInputField'
import { Layout } from '../components/Layout'
import { useRegisterUserMutation } from '../generated/graphql'
import { mapErrors } from '../utils/mapErrors'

const Register = () => {
  const navigate = useNavigate()
  const [register] = useRegisterUserMutation()

  return (
    <Layout>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required('Required'),
          lastName: Yup.string().required('Required'),
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          username: Yup.string().required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ variables: { input: values } })
          if (response.data?.register.errors) {
            console.log(response.data?.register.errors)
            setErrors(mapErrors(response.data?.register.errors))
          } else if (response.data?.register.user) {
            console.log(response.data?.register.user)
            navigate('/')
          }
        }}
      >
        {(formik) => (
          <Form className='user-form' onSubmit={formik.handleSubmit}>
            <Row className='user-form-row'>
              <FormInputField label='First Name' name='firstName' />
              <FormInputField label='Last Name' name='lastName' />
            </Row>
            <Row className='user-form-row'>
              <FormInputField label='Email' name='email' />
            </Row>
            <Row className='user-form-row'>
              <FormInputField label='Username' name='username' />
            </Row>
            <Row className='user-form-row'>
              <FormInputField
                label='Password'
                name='password'
                type='password'
              />
            </Row>
            <Button variant='primary' type='submit'>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default Register
