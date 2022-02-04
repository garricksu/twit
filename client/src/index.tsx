import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CurrentAuth } from './components/CurrentAuth'
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
        <Route
          path='/register'
          element={
            <CurrentAuth>
              <Register />
            </CurrentAuth>
          }
        />
        <Route
          path='/login'
          element={
            <CurrentAuth>
              <Login />
            </CurrentAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)
