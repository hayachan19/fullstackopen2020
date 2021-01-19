import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const BlogDetails = ({ blog }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const currentUser = useSelector(state => state.currentUser)

  const deleteHandler = () => {
    dispatch(deleteBlog(blog));
    history.push('/')
  }
  const commentHandler = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    dispatch(commentBlog(blog.id, comment))
    event.target.comment.value = ''
  }

  if (!blog) { return null }
  return (<div>
    <h2>{blog.title} {blog.author}</h2>
    <p><a href={blog.url}>{blog.url}</a></p>
    <p>{blog.likes} likes <Button onClick={() => dispatch(likeBlog(blog))}>like</Button></p>
    <p>added by {blog.user.name}  {currentUser.username === blog.user.username && <Button variant='danger' onClick={() => deleteHandler()}>delete</Button>}</p>
    <h3>comments</h3>
    <Form onSubmit={commentHandler}>
      <Form.Control name='comment' />
      <Button type='submit'>add comment</Button>
    </Form>
    <ul>
      {blog.comments.map((comment, index) => <li key={index}>{comment}</li>)}
    </ul>
  </div>)
}

export default BlogDetails
