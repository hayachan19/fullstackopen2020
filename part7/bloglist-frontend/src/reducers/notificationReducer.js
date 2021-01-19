const initialState = { content: '', type: '' }

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NOTIFICATION_SET':
            return { ...action.data }
        case 'NOTIFICATION_CLEAR':
            return initialState
        default:
            return state
    }
}

export const setNotification = (content, type) => {
    return {
        type: 'NOTIFICATION_SET',
        data: {
            content, type
        }
    }
}

export const clearNotification = () => {
    return {
        type: 'NOTIFICATION_CLEAR',
        data: {
        }
    }
}

const timer = null
export const doNotification = (content, type, time) => {
    return dispatch => {
        dispatch(setNotification(content, type))
        clearTimeout(timer)
        setTimeout(() => dispatch(clearNotification()), time * 1000)
    }
}

export default notificationReducer