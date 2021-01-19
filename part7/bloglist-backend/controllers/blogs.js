const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const result = await Blog.find({}).populate('user', { 'username': 1, 'name': 1 })
    return response.json(result)
})

blogsRouter.post('/', async (request, response) => {
    if (!request.token) {
        return response.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if (!request.body.title) return response.status(400).json({ error: 'title is missing' })
    if (!request.body.url) return response.status(400).json({ error: 'url is missing' })

    const newBlog = new Blog({
        ...request.body,
        author: request.body.author || 'Unknown',
        likes: request.body.likes || 0,
        user: user.id
    })
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    //user must be populated before return
    const populated = await Blog.findById(savedBlog.id).populate('user', { 'username': 1, 'name': 1 })
    response.status(201).json(populated)
})

blogsRouter.delete('/:id', async (request, response) => {
    if (!request.token) {
        return response.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }
    if (!(decodedToken.id.toString() === blog.user.toString())) {
        return response.status(403).json({ error: 'invalid user' })
    }
    await Blog.deleteOne(blog)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = { ...request.body }
    const result = await Blog.findByIdAndUpdate(request.params.id, blog, { runValidators: true, new: true })
    const populated = await Blog.findById(blog.id).populate('user', { 'username': 1, 'name': 1 })
    response.json(populated)
})

blogsRouter.post('/:id/comments', async (request, response) => {
    if (!request.token) {
        return response.status(401).json({ error: 'token missing' })
    }
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    if (!request.body.comment) return response.status(400).json({ error: 'comment is missing' })

    const blog = await Blog.findById(request.params.id)
    blog.comments = blog.comments.concat(request.body.comment)
    const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { runValidators: true, new: true })
    //user must be populated before return
    const populated = await Blog.findById(savedBlog.id).populate('user', { 'username': 1, 'name': 1 })
    response.status(201).json(populated)
})

module.exports = blogsRouter