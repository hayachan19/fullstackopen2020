const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Blog Posts Considered Harmful",
        author: "Internet Person",
        url: "https://blog.example/blog-posts-considered-harmful",
        likes: 555
    },
    {
        title: "How to make a full stack server in five lines of code",
        author: "Python Master",
        url: "https://pythonmaster.io/full-stack-python-package",
        likes: 456
    }
]
const exampleBlog = {
    title: "Example Blog Post",
    author: "Jest",
    url: "https://jestjs.io/",
    likes: 9000
}
const testUsers = [
    {
        username: "blogtestuser",
        password: "blogtestpassword",
    },
    {
        username: "anotheruser",
        password: "anotherpassword"
    }
]
let loginToken = null;

beforeAll(async () => {
    await User.deleteMany({})
    for (let user of testUsers) {
        await api.post('/api/users').send(user)
    }
})

beforeEach(async () => {
    let userLogin = await api.post('/api/login').send(testUsers[0])
    loginToken = JSON.parse(userLogin.text).token
    await Blog.deleteMany({})
    for (let blog of initialBlogs) {
        blog.user = await User.findOne({ 'username': testUsers[0].username })
        let newBlog = new Blog(blog)
        await newBlog.save()
    }
})

test('2 blogs are returned as json', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('unique identifier prop is named id', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    expect(response.body[0].id).toBeDefined()
})

describe('post method', () => {
    test('creates a new blog post', async () => {
        await api.post('/api/blogs').set('Authorization', `Bearer ${loginToken}`).send(exampleBlog)
            .expect(201).expect('Content-Type', /application\/json/)
        const response = await api.get('/api/blogs')
        const blogs = response.body.map(item => item.title)
        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(blogs).toContain(exampleBlog.title)
    })

    test('sets missing likes to default value of 0', async () => {
        const exampleBlog = {
            title: "Unliked Blog",
            author: "Sad",
            url: "http://localhost/sadblog",
        }
        const response = await api.post('/api/blogs').set('Authorization', `Bearer ${loginToken}`).send(exampleBlog)
            .expect(201).expect('Content-Type', /application\/json/)
        expect(response.body.likes).toEqual(0)
    })

    test('returns 400 bad request when title and url are missing', async () => {
        const exampleBlogNoUrl = {
            title: "A Blog With No Place",
            author: "Clueless",
            likes: 5
        }
        const responseNoUrl = await api.post('/api/blogs').set('Authorization', `Bearer ${loginToken}`).send(exampleBlogNoUrl)
            .expect(400).expect('Content-Type', /application\/json/)
        expect(responseNoUrl.body.error).toContain('url is missing')

        const exampleBlogNoTitle = {
            url: "http://supersecretblog.hastalavista.net",
            author: "Clueless",
            likes: 5
        }
        const responseNoTitle = await api.post('/api/blogs').set('Authorization', `Bearer ${loginToken}`).send(exampleBlogNoTitle)
            .expect(400).expect('Content-Type', /application\/json/)
        expect(responseNoTitle.body.error).toContain('title is missing')
    })

    test('returns 401 if token is missing', async () => {
        await api.post('/api/blogs').send(exampleBlog)
            .expect(401).expect('Content-Type', /application\/json/)
    })
})

describe('delete method', () => {
    test('as the owner removes a specified blog post', async () => {
        const newBlog = await api.post('/api/blogs').set('Authorization', `Bearer ${loginToken}`).send(exampleBlog)
            .expect(201).expect('Content-Type', /application\/json/)
        await api.delete(`/api/blogs/${newBlog.body.id}`).set('Authorization', `Bearer ${loginToken}`).expect(204)
        const response = await api.get('/api/blogs')
        expect(response.body).not.toContain(newBlog.body.id)
        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('as other user returns 403', async () => {
        const newBlog = await api.post('/api/blogs').set('Authorization', `Bearer ${loginToken}`).send(exampleBlog)
            .expect(201).expect('Content-Type', /application\/json/)
        const anotherUser = await api.post('/api/login').send(testUsers[1])
        const anotherUserToken = JSON.parse(anotherUser.text).token
        await api.delete(`/api/blogs/${newBlog.body.id}`).set('Authorization', `Bearer ${anotherUserToken}`).expect(403)
    })
})

test('put updates a specified blog post', async () => {
    const newBlog = await api.post('/api/blogs').set('Authorization', `Bearer ${loginToken}`).send(exampleBlog)
        .expect(201).expect('Content-Type', /application\/json/)
    const result = await Blog.findById(newBlog.body.id)
    const updatedBlog = {
        title: result.title,
        author: result.author,
        url: result.url,
        likes: result.likes + 1,
        user: result.user
    }
    const response = await api.put(`/api/blogs/${newBlog.body.id}`).send(updatedBlog)
        .expect(200).expect('Content-Type', /application\/json/)
    expect(response.body.likes).toEqual(result.likes + 1)
})

afterAll(() => {
    mongoose.connection.close()
})