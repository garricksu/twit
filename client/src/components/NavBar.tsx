import React from 'react'
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const NavBar = ({}) => {
  return (
    <Nav className='main-nav'>
      <Button variant='dark' className='main-nav-button'>
        <Link to='/' className='nav-link'>
          Home
        </Link>
      </Button>
    </Nav>
  )
}
