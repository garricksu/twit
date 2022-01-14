import { Button, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {
  useCurrentUserQuery,
  useLogoutUserMutation,
  CurrentUserQuery,
  CurrentUserDocument,
} from '../generated/graphql'

export const UserSideBar = ({}) => {
  const { data, loading } = useCurrentUserQuery()
  const [logout] = useLogoutUserMutation()

  const returnUserBar = () => {
    if (loading) {
      return <></>
    } else if (data?.currentUser) {
      return (
        <div>
          <h1>{data?.currentUser?.firstName}</h1>
          <Button
            variant='dark'
            className='main-nav-button'
            onClick={async () => {
              await logout({
                update: (cache, { data }) => {
                  if (data?.logout)
                    cache.writeQuery<CurrentUserQuery>({
                      query: CurrentUserDocument,
                      data: {
                        currentUser: null,
                      },
                    })
                },
              })
            }}
          >
            Logout
          </Button>
        </div>
      )
    } else {
      return (
        <>
          <Button variant='dark' className='main-nav-button'>
            <Link to='/login' className='nav-link'>
              Login
            </Link>
          </Button>
          <Button variant='dark' className='main-nav-button'>
            <Link to='/register' className='nav-link'>
              Register
            </Link>
          </Button>
        </>
      )
    }
  }
  return <Nav className='main-nav'>{returnUserBar()}</Nav>
}
