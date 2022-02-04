import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavBar } from './NavBar'

interface LayoutProps {
  sideBar: JSX.Element
}

export const Layout: React.FC<LayoutProps> = ({ children, sideBar }) => {
  return (
    <div className='base-page'>
      <Container>
        <Row>
          <Col className='py-4'>
            <NavBar />
          </Col>
          <Col xs={6} className='content-col py-4'>
            {children}
          </Col>
          <Col className='py-4'>{sideBar}</Col>
        </Row>
      </Container>
    </div>
  )
}
