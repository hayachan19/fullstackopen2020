import blogService from '../services/blogs'
import { doNotification } from './notificationReducer'
const initialState = []

const blogReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'BLOG_ADD':
            return [...state, action.data]
        case 'BLOG_DELETE':
            return state.filter(blog => blog.id !== action.data)
        case 'BLOG_LIKE':
            return state.map(blog => blog.id === action.data.id ? action.data : blog)
        case 'BLOG_COMMENT':
            return state.map(blog => blog.id === action.data.id ? action.data : blog)
        case 'BLOG_INIT':
            return action.data
        default:
            return state
    }
}

export const addBlog = (newBlog) => {
    return async dispatch => {
        try {
            const response = await blogService.create(newBlog)
            dispatch({
                type: 'BLOG_ADD',
                data: response
            })
            dispatch(doNotification(`a new blog ${response.title} by ${response.author} added`, 'success', 5))
        } catch (error) {
            dispatch(doNotification(error, 'danger', 5))
        }
    }
}

export const deleteBlog = (blog) => {
    return async dispatch => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            try {
                await blogService.remove(blog.id)
                dispatch({
                    type: 'BLOG_DELETE',
                    data: blog.id
                })
                dispatch(doNotification(`blog ${blog.title} by ${blog.author} removed`, 'success', 5))
            } catch (error) {
                dispatch(doNotification(error, 'danger', 5))
            }
        }
    }
}

export const likeBlog = (blog) => {
    return async dispatch => {
        try {
            const newBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
            const response = await blogService.update(blog.id, newBlog)
            dispatch({
                type: 'BLOG_LIKE',
                data: response
            })
        } catch (error) {
            dispatch(doNotification(error, 'danger', 5))
        }
    }
}

export const commentBlog = (id,comment) => {
    return async dispatch => {
        try {
            const response = await blogService.comment(id, comment)
            dispatch({
                type: 'BLOG_COMMENT',
                data: response
            })
        } catch (error) {
            dispatch(doNotification(error, 'danger', 5))
        }
    }
}

export const initializeBlogs = () => {
    return async dispatch => {
        const response = await blogService.getAll()
        dispatch({
            type: 'BLOG_INIT',
            data: response
        })
    }
}

export default blogReducer