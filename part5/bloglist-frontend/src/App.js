import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notificationText, setNotificationText] = useState('')
  const [notificationType, setNotificationType] = useState('')

  const blogFormRef = useRef()
  const blogRefs = useRef({})

  const sortByLikes = (items) => {
    return items.sort((a, b) => b.likes - a.likes)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(sortByLikes(blogs))
    )
  }, [])
  useEffect(() => {
    const currentUser = window.localStorage.getItem('currentUser')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleFormLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('currentUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    }
    catch (error) {
      setNotificationText('wrong credentials')
      setNotificationType('error')
      setTimeout(() => { setNotificationText(null) }, 5000)
    }
  }

  const handleButtonLogout = () => {
    window.localStorage.removeItem('currentUser')
    setUser(null)
  }

  const addBlog = async (newBlog) => {
    try {
      const result = await blogService.create(newBlog)
      setBlogs(sortByLikes(await blogService.getAll())) //backend's response doesn't populate user field with details, better grab the fresh list to have everything working
      blogFormRef.current.toggleVisibility()
      setNotificationText(`a new blog ${result.title} by ${result.author} added`)
      setNotificationType('success')
      setTimeout(() => { setNotificationText(null) }, 5000)
    } catch (error) {
      setNotificationText(error.response.data.error)
      setNotificationType('error')
      setTimeout(() => { setNotificationText(null) }, 5000)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setNotificationText(`blog ${blog.title} by ${blog.author} removed`)
        setNotificationType('success')
        setTimeout(() => { setNotificationText(null) }, 5000)
      }
    } catch (error) {
      setNotificationText(error.response.data.error)
      setNotificationType('error')
      setTimeout(() => { setNotificationText(null) }, 5000)
    }
  }

  const likeBlog = async (blog) => {
    const update = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    await blogService.update(blog.id, update)
    blogRefs.current[blog.id].changeLikes(update.likes)
    setBlogs(sortByLikes(blogs.filter(b => b.id === blog.id ? b : update)))
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification text={notificationText} type={notificationType} />
        <form onSubmit={handleFormLogin}>
          <div>username<input id="username" value={username} onChange={({ target }) => setUsername(target.value)} /></div>
          <div>password<input id="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
          <div><button id="login" type="submit">login</button></div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification text={notificationText} type={notificationType} />
      <div>{user.name} logged in<button id="logout" onClick={() => handleButtonLogout()}>logout</button></div>
      <Toggleable openLabel='add blog' closeLabel='cancel' ref={blogFormRef}>
        <BlogForm createHandler={addBlog} />
      </Toggleable>

      {blogs.map(blog => (
        <Blog ref={(element) => blogRefs.current[blog.id] = element} key={blog.id} blog={blog} likeHandler={likeBlog} deleteHandler={deleteBlog} loggedUsername={user.username} />
      )
      )}
    </div>
  )
}

export default App