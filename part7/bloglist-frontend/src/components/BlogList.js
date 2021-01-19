import React from 'react'
import { Link } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'
import { useSelector } from 'react-redux'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
  const sortByLikes = (items) => {
    return items.sort((a, b) => b.likes - a.likes)
  }
  return (
    <><h2>blogs</h2>
      <ListGroup>
        {sortByLikes(blogs).map(blog => (
          <ListGroup.Item key={blog.id}>
            <Link to={`blogs/${blog.id}`}>
              {blog.title} {blog.author} <Badge variant="primary">{blog.likes}</Badge>
              <span className="sr-only">likes</span>
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>)
}

export default BlogList
