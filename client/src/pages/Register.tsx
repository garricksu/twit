import { Formik } from 'formik'
import { Button, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { FormInputField } from '../components/FormInputField'
import { Layout } from '../components/Layout'
import { UserSideBar } from '../components/UserSideBar'
import {
  CurrentUserDocument,
  CurrentUserQuery,
  useRegisterUserMutation,
} from '../generated/graphql'
import { mapErrors } from '../utils/mapErrors'

const Register = () => {
  const navigate = useNavigate()
  const [register] = useRegisterUserMutation()

  return (
    <Layout sideBar={<UserSideBar />}>
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
          const response = await register({
            variables: { input: values },
            update: (cache, { data }) => {
              if (data?.register.user) {
                cache.writeQuery<CurrentUserQuery>({
                  query: CurrentUserDocument,
                  data: {
                    currentUser: data?.register.user,
                  },
                })
                navigate('/')
              }
            },
          })
          if (response.data?.register.errors) {
            setErrors(mapErrors(response.data?.register.errors))
          }
        }}
      >
        {(formik) => (
          <Form className='user-form' onSubmit={formik.handleSubmit}>
            <Row className='user-form-row'>
              <FormInputField label='First Name' name='firstName' type='text' />
              <FormInputField label='Last Name' name='lastName' type='text' />
            </Row>
            <Row className='user-form-row'>
              <FormInputField label='Email' name='email' type='text' />
            </Row>
            <Row className='user-form-row'>
              <FormInputField label='Username' name='username' type='text' />
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
