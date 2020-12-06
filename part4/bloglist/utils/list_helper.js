const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, current) => sum + current.likes, 0)
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((a, b) => (a.likes > b.likes) ? a : b)
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    const authorBlogs = _.countBy(blogs, 'author')
    const most = _.max(_.entries(authorBlogs))
    return {
        'author': most[0],
        'blogs': most[1]
    }
}

const mostLikes = (blogs) => {
    const blogsByAuthor = _.groupBy(blogs, 'author')
    let authorLikes = []
    _.forEach(blogsByAuthor, function (blog) {
        const total = _.reduce(blog, function (sum, n) {
            return sum + n.likes
        }, 0)
        authorLikes.push({author: blog[0].author, likes: total})
    })    
    const most = _.maxBy(authorLikes,'likes')
    return {
        'author': most.author,
        'likes': most.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
