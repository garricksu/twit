import React from 'react'
import { Layout } from '../components/Layout'
import { UserSideBar } from '../components/UserSideBar'

function Home() {
  return (
    <Layout sideBar={<UserSideBar />}>
      <h1 className='text-primary'>Hello</h1>
    </Layout>
  )
}

export default Home
