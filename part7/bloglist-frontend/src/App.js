import React, { useEffect } from 'react'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import { logoutUser, authorizeUser } from './reducers/loginReducer'
import { Switch, Route, Link, useRouteMatch } from "react-router-dom"
import UserList from './components/UserList'
import UserDetails from './components/UserDetails'
import BlogDetails from './components/BlogDetails'
import LoginForm from './components/LoginForm'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)
  const currentUser = useSelector(state => state.currentUser)

  const userMatch = useRouteMatch('/users/:id')
  const matchedUser = userMatch ? users.find(user => user.id === userMatch.params.id) : null
  const blogMatch = useRouteMatch('/blogs/:id')
  const matchedBlog = blogMatch ? blogs.find(blog => blog.id === blogMatch.params.id) : null

  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(initializeBlogs())

    const currentUser = window.localStorage.getItem('currentUser')
    if (currentUser) {
      dispatch(authorizeUser(JSON.parse(currentUser)))
    }
  }, [dispatch])

  const handleButtonLogout = () => {
    dispatch(logoutUser())
  }
  if (currentUser === null) {
    return (
      <div className="container">
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }
  return (
    <div className="container">
      <Navbar collapseOnSelect expand="lg" bg="light">
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">blogs</Nav.Link>
            <Nav.Link as={Link} to="/users">users</Nav.Link>
          </Nav>
          <Navbar.Text>{currentUser.name} logged in</Navbar.Text>
        &nbsp;
        <Button id="logout" onClick={() => handleButtonLogout()}>logout</Button>
        </Navbar.Collapse>
      </Navbar>
      <Notification />
      <Switch>
        <Route path='/users/:id'>
          <UserDetails user={matchedUser} />
        </Route>
        <Route path='/users'>
          <UserList />
        </Route>
        <Route path='/blogs/:id'>
          <BlogDetails blog={matchedBlog} />
        </Route>
        <Route path='/'>
          <BlogForm />
          <BlogList />
        </Route>

      </Switch>
    </div>
  )
}
export default App