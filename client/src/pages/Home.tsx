import React from 'react'
import { useNavigate } from 'react-router'
import { CreateTweet } from '../components/CreateTweet'
import { Layout } from '../components/Layout'
import { Timeline } from '../components/Timeline'
import { UserSideBar } from '../components/UserSideBar'

function Home() {
  const navigate = useNavigate()
  return (
    <Layout sideBar={<UserSideBar navigate={navigate} />}>
      <CreateTweet />
      <Timeline />
    </Layout>
  )
}

export default Home
