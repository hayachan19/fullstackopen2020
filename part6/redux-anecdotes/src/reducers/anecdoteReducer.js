import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'ANECDOTE_VOTE':
      const votedOn = state.find(item => item.id === action.data.id)
      return state.map(item => item.id === action.data.id ? votedOn : item)
    case 'ANECDOTE_ADD':
      return [...state, action.data]
    case 'ANECDOTE_INIT':
      return action.data
    default:
      return state
  }
}

export const giveVote = (anecdote) => {
  return async dispatch => {
    const votedOn = await anecdoteService.updateVote(anecdote)
    dispatch({
      type: 'ANECDOTE_VOTE',
      data: { id: votedOn.id }
    })
  }
}

export const addAnecdote = (content) => {
  return async dispatch => {
    const newItem = await anecdoteService.createNew(content, getId())
    dispatch({
      type: 'ANECDOTE_ADD',
      data: newItem
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'ANECDOTE_INIT',
      data: anecdotes,
    })
  }
}

export default anecdoteReducer