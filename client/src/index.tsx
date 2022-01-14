import { ApolloProvider } from '@apollo/client'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import './styles/App.scss'
import { client } from './utils/createApolloClient'

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)

