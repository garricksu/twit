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
  useLoginUserMutation
} from '../generated/graphql'
import { client } from '../utils/createApolloClient'
import { mapErrors } from '../utils/mapErrors'

const Login = () => {
  const navigate = useNavigate()
  const [login] = useLoginUserMutation()
  const data = client.readQuery<CurrentUserQuery>({
    query: CurrentUserDocument,
  })

  return (
    <Layout sideBar={<UserSideBar navigate={navigate} />}>
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
          const response = await login({
            variables: { input: values },

            update: (cache, { data }) => {
              if (data?.login.user) {
                cache.writeQuery<CurrentUserQuery>({
                  query: CurrentUserDocument,
                  data: {
                    currentUser: data?.login.user,
                  },
                })

                navigate('/')
              }
            },
          })
          if (response.data?.login.errors) {
            setErrors(mapErrors(response.data?.login.errors))
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
