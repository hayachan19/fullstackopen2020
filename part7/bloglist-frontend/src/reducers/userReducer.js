import userService from '../services/users'
const initialState = []

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_INIT':
            return action.data
        default:
            return state
    }
}

export const initializeUsers = () => {
    return async dispatch => {
        const response = await userService.getAll()
        dispatch({
            type: 'USER_INIT',
            data: response
        })
    }
}

export default userReducer