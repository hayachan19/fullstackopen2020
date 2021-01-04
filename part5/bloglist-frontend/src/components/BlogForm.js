import React, { useState } from 'react'

const BlogForm = ({ createHandler }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const handleFormCreate = async (event) => {
    event.preventDefault()
    createHandler({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleFormCreate}>
        <div>title:<input id="title" value={blogTitle} onChange={({ target }) => setBlogTitle(target.value)} /></div>
        <div>author:<input id="author" value={blogAuthor} onChange={({ target }) => setBlogAuthor(target.value)} /></div>
        <div>url:<input id="url" value={blogUrl} onChange={({ target }) => setBlogUrl(target.value)} /></div>
        <div><button id="addBlog" type="submit">create</button></div>
      </form>
    </>)
}

export default BlogForm