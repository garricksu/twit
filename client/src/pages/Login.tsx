import { Formik } from 'formik'
import { Button, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { FormInputField } from '../components/FormInputField'
import { Layout } from '../components/Layout'
import { useLoginUserMutation } from '../generated/graphql'
import { mapErrors } from '../utils/mapErrors'

const Login = () => {
  const navigate = useNavigate()
  const [login, error] = useLoginUserMutation()

  return (
    <Layout>
      <Formik
        initialValues={{
          emailOrUsername: '',
          password: '',
        }}
        validationSchema={Yup.object({
          emailOrUsername: Yup.string().required('Required'),
          password: Yup.string().required('Required'),
        })}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ variables: { input: values } })
          if (error) {
            console.log(error)
          }
          if (response.data?.login.errors) {
            console.log(response.data?.login.errors)
            setErrors(mapErrors(response.data?.login.errors))
          } else if (response.data?.login.user) {
            console.log(response)
            navigate('/')
          }
        }}
      >
        {(formik) => (
          <Form className='user-form' onSubmit={formik.handleSubmit}>
            <Row className='user-form-row'>
              <FormInputField
                label='Email or Username'
                name='emailOrUsername'
                type='text'
              />
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

export default Login
