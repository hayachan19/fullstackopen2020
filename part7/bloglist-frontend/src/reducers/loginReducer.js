import loginService from '../services/login'
import blogService from '../services/blogs'
import { doNotification } from './notificationReducer'
const initialState = null

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_LOGOUT':
            return initialState
        case 'LOGIN_AUTHORIZE':
            return action.data
        default:
            return state
    }
}

export const loginUser = (username, password) => {
    return async dispatch => {
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('currentUser', JSON.stringify(user))
            dispatch(authorizeUser(user))
        } catch (error) {
            dispatch(doNotification('wrong credentials', 'danger', 5))
        }
    }
}

export const logoutUser = () => {
    return async dispatch => {
        blogService.setToken(null)
        window.localStorage.removeItem('currentUser')
        dispatch({
            type: 'LOGIN_LOGOUT',
            data: {}
        })
    }
}

export const authorizeUser = (user) => {
    return async dispatch => {
        blogService.setToken(user.token)
        dispatch({
            type: 'LOGIN_AUTHORIZE',
            data: user
        })
    }
}

export default loginReducer