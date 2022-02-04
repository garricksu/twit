import React from 'react'
import { Navigate } from 'react-router'
import { useCurrentUserQuery } from '../generated/graphql'

export const CurrentAuth: React.FC = ({ children }) => {
  const { data, loading } = useCurrentUserQuery()

  if (loading) {
    return null
  }

  return <>{data?.currentUser && !loading ? <Navigate to={'/'} /> : children}</>
}
