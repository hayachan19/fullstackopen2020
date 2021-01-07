const initialState = {
    content: '',
    visible: false
}

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NOTIFICATION_ADD':
            return { content: action.data.content, visible: true }
        case 'NOTIFICATION_CLEAR':
            return initialState
        default:
            return state
    }
}

let timer = null
export const doNotification = (content, timeout) => {
    return dispatch => {
        dispatch(setNotification(content))
        clearTimeout(timer)
        timer = setTimeout(() => { dispatch(clearNotification()) }, timeout * 1000)
    }
}

export const setNotification = (content) => {
    return {
        type: 'NOTIFICATION_ADD',
        data: { content, visible: true }
    }
}

export const clearNotification = () => {
    return {
        type: 'NOTIFICATION_CLEAR',
        data: { ...initialState }
    }
}

export default notificationReducer