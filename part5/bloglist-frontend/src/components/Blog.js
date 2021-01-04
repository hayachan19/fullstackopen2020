import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
const Blog = React.forwardRef(({ blog, likeHandler, deleteHandler, loggedUsername }, ref) => {
  const [visible, setVisible] = useState(false)
  const hiddenByDefault = { display: visible ? '' : 'none' }
  const flipFlop = () => { setVisible(!visible) }
  const [likes, setLikes] = useState(blog.likes)
  const changeLikes = (likes) => { blog.likes = likes; setLikes(blog.likes) }
  useImperativeHandle(ref, () => { return { changeLikes } })

  return <div className='blog_item'>
    {blog.title} {blog.author}
    <button onClick={() => flipFlop()}>{visible ? 'hide' : 'view'}</button>
    <div style={hiddenByDefault} className='toggleable'>
      <p>{blog.title} {blog.author}</p>
      <p><span className='blog_url'>{blog.url}</span></p>
      <p>likes <span className='blog_likes'>{likes}</span><button onClick={() => { likeHandler(blog) }}>like</button></p>
      <p>{blog.user.name}</p>
      {loggedUsername === blog.user.username && <button onClick={() => deleteHandler(blog)}>delete</button>}
    </div>

  </div>
})

Blog.displayName = 'Blog'
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  loggedUsername: PropTypes.string.isRequired
}

export default Blog
