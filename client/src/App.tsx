import { useUserQuery, useUsersQuery } from './generated/graphql'

function App() {
  const { data, loading } = useUsersQuery()
  const { data: userData } = useUserQuery({
    variables: {
      userId: Math.floor(Math.random() * 10) + 11,
    },
  })
  console.log(data)
  return (
    <div className='App'>
      <div>
        <p>random user: {userData?.user?.firstName}</p>
      </div>
      {data?.users?.map((user) => {
        return (
          <p key={user.id}>
            {user.firstName} {user.lastName}
          </p>
        )
      })}
    </div>
  )
}

export default App
