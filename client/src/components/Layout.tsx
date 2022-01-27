import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavBar } from './NavBar'

interface LayoutProps {
  sideBar: JSX.Element
}

export const Layout: React.FC<LayoutProps> = ({ children, sideBar }) => {
  return (
    <div className='base-page'>
      <Container className='py-5'>
        <Row>
          <Col>
            <NavBar />
          </Col>
          <Col xs={6} className='content-col'>
            {children}
          </Col>
          <Col>
            {sideBar}
          </Col>
        </Row>
      </Container>
    </div>
  )
}
