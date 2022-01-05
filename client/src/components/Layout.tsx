import React from 'react'
import { Container } from 'react-bootstrap'
import { Errors } from '../components/Errors'

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <h1>hello</h1>

      <Container className='py-5'>{children}</Container>
    </>
  )
}
