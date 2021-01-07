import React from 'react'
//import { useSelector, useDispatch } from 'react-redux'
import { connect } from 'react-redux'
import { giveVote } from '../reducers/anecdoteReducer'
import { doNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
    //const anecdotes = useSelector(state => state.anecdotes)
    //const filter = useSelector(state => state.filter)
    //const dispatch = useDispatch()

    const sortByVotes = (items) => {
        return items.sort((a, b) => b.votes - a.votes)
    }

    const vote = (anecdote) => {
        //dispatch(giveVote(anecdote))
        //dispatch(doNotification(`you voted '${anecdotes.find(item => item.id === anecdote.id).content}'`, 5))
        props.giveVote(anecdote)
        props.doNotification(`you voted '${props.anecdotes.find(item => item.id === anecdote.id).content}'`, 5)
    }

    //const itemsToShow = anecdotes.filter(item => item.content.includes(filter.toLowerCase()))
    //return <>{sortByVotes(itemsToShow).map(anecdote =>
    return <>{sortByVotes(props.anecdotes).map(anecdote =>
        <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote)}>vote</button>
            </div>
        </div>
    )}</>
}

const mapStateToProps = (state) => {
    return {
        //anecdotes: state.anecdotes,
        //filter: state.filter,
        anecdotes: state.anecdotes.filter(item => item.content.includes(state.filter.toLowerCase()))
    }
}
const mapDispatchToProps = { giveVote, doNotification }

const ConnectedAnecdoteForm = connect(mapStateToProps, mapDispatchToProps)(AnecdoteForm)

export default ConnectedAnecdoteForm
//export default AnecdoteForm