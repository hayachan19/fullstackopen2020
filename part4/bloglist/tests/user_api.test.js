const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
    {
        username: "testuser",
        name: "Test User",
        passwordHash: "testnotforuse",
        blogs: [],
    },
    {
        username: "realuser",
        name: "Real User",
        passwordHash: "realnotforuse",
        blogs: [],
    }
]
const exampleUser = {
    username: "exampleuser",
    name: "Example User",
    password: "examplepassword",
}

beforeEach(async () => {
    await User.deleteMany({})
    for (const user of initialUsers) {
        const newUser = new User(user)
        await newUser.save()
    }
})

test('valid user is added to database', async () => {
    await api.post('/api/users').send(exampleUser)
        .expect(201).expect('Content-Type', /application\/json/)
})

describe('invalid user is rejected and the reason is given', () => {
    test('when password is missing', async () => {
        let response = await api.post('/api/users').send({
            username: "missingpass"
        }).expect(400).expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('password is missing')
    })

    test('when username is missing', async () => {
        response = await api.post('/api/users').send({
            password: "iforgotmyusernamehelp"
        }).expect(400).expect('Content-Type', /application\/json/)
    })

    test('when password is too short', async () => {
        response = await api.post('/api/users').send({
            username: "shortpass",
            password: "pw"
        }).expect(400).expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('password must be at least 3 characters long')
    })
    test('when username is too short', async () => {
        response = await api.post('/api/users').send({
            username: "a",
            password: "goodpass"
        }).expect(400).expect('Content-Type', /application\/json/)
    })
})

afterAll(() => {
    mongoose.connection.close()
})