const testUsers = [
  {
    name: 'Cypress User',
    username: 'cypress',
    password: 'cypress'
  },
  {
    name: 'Another User',
    username: 'another',
    password: 'another'
  }
]

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', testUsers[0])
    cy.request('POST', 'http://localhost:3003/api/users/', testUsers[1])
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type(testUsers[0].username)
      cy.get('#password').type(testUsers[0].password)
      cy.get('#login').click()
      cy.contains(`${testUsers[0].name} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('baduser')
      cy.get('#password').type('baduser')
      cy.get('#login').click()
      cy.get('.error').contains('wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    const testBlogs = [{
      title: 'Cypress Blog',
      author: 'Cypress',
      url: 'localhost'
    },
    {
      title: 'Another Blog',
      author: 'Another',
      url: 'awayhost'
    },
    ]
    beforeEach(function () {
      cy.get('#username').type(testUsers[0].username)
      cy.get('#password').type(testUsers[0].password)
      cy.get('#login').click()
      cy.contains(`${testUsers[0].name} logged in`)
    })

    it('A blog can be created', function () {
      cy.contains('add blog').click()
      cy.get('#title').type(testBlogs[0].title)
      cy.get('#author').type(testBlogs[0].author)
      cy.get('#url').type(testBlogs[0].url)
      cy.get('#addBlog').click()
      cy.get('.blog_item').contains(`${testBlogs[0].title} ${testBlogs[0].author}`)
      cy.contains('view').click()
      cy.get('.blog_item').contains(`${testUsers[0].name}`)
    })

    it('A blog can be liked', function () {
      cy.contains('add blog').click()
      cy.get('#title').type(testBlogs[0].title)
      cy.get('#author').type(testBlogs[0].author)
      cy.get('#url').type(testBlogs[0].url)
      cy.get('#addBlog').click()

      cy.contains('view').click()
      cy.contains('like').click()
      cy.get('p').contains(`likes ${0 + 1}`)
    })

    it('A blog can be deleted', function () {
      cy.contains('add blog').click()
      cy.get('#title').type(testBlogs[0].title)
      cy.get('#author').type(testBlogs[0].author)
      cy.get('#url').type(testBlogs[0].url)
      cy.get('#addBlog').click()

      cy.contains('view').click()
      cy.contains('delete').click()
      cy.get('.blog_item').should('not.exist')
    })

    it('Someone\'s blog cannot be deleted', function () {
      cy.contains('add blog').click()
      cy.get('#title').type(testBlogs[0].title)
      cy.get('#author').type(testBlogs[0].author)
      cy.get('#url').type(testBlogs[0].url)
      cy.get('#addBlog').click()
      cy.wait(1000) //workaround for notification being updated too fast
      cy.get('#logout').click()
      cy.get('#username').type(testUsers[1].username)
      cy.get('#password').type(testUsers[1].password)
      cy.get('#login').click()
      cy.contains(`${testUsers[1].name} logged in`)
      cy.contains('view').click()
      cy.contains('delete').should('not.exist')
    })

    it('Blogs are sorted by likes (descending)', function () {
      cy.contains('add blog').click()
      cy.get('#title').type(testBlogs[0].title)
      cy.get('#author').type(testBlogs[0].author)
      cy.get('#url').type(testBlogs[0].url)
      cy.get('#addBlog').click()

      cy.contains('add blog').click()
      cy.get('#title').type(testBlogs[1].title)
      cy.get('#author').type(testBlogs[1].author)
      cy.get('#url').type(testBlogs[1].url)
      cy.get('#addBlog').click()
      cy.wait(1000) //wait for both blogs to be added

      cy.get('.blog_item').each((item) => { cy.get(item).contains('view').click(); cy.get(item).contains('like').click() })
      cy.get('.blog_item').eq(1).contains('like').click() //uses second item
      let allLikes = []
      cy.get('.blog_likes').each((item, index) => {
        allLikes.push(item[0].textContent)
        if (index !== 0) { //workaround for first result being NaN
          cy.wrap(allLikes[index - 1] - allLikes[index]).should('be.gte', 0)
        }
      })
    })
  })

})
