const filterReducer = (state = '', action) => {
    switch (action.type) {
        case 'FILTER_CHANGE':
            return action.data
        default:
            return state
    }
}

export const changeFilter = (filter) => {
    return {
        type: 'FILTER_CHANGE',
        data: filter
    }
}

export default filterReducer