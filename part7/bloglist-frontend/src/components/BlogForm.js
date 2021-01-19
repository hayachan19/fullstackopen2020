import React, { useRef } from 'react'
import Toggleable from '../components/Toggleable'
import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogReducer'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
const BlogForm = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()
  const handleFormCreate = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    dispatch(addBlog({ title, author, url }))
    blogFormRef.current.toggleVisibility()
  }

  return (
    <Toggleable openLabel='add blog' closeLabel='cancel' ref={blogFormRef}>
      <h2>create new</h2>
      <Form onSubmit={handleFormCreate}>
        <Form.Label>title:</Form.Label>
        <Form.Control name="title" />
        <Form.Label>author:</Form.Label>
        <Form.Control name="author" />
        <Form.Label>url:</Form.Label>
        <Form.Control name="url" />
        <Button id="addBlog" type="submit">create</Button>
      </Form>
    </Toggleable>)
}

export default BlogForm