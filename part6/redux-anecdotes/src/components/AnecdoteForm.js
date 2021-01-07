import React from 'react'
//import { useDispatch } from 'react-redux'
import { connect } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { doNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
    //const dispatch = useDispatch()

    const addNew = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        //dispatch(addAnecdote(content))
        //dispatch(doNotification(`you added '${content}'`,5))
        props.addAnecdote(content)
        props.doNotification(`you added '${content}'`, 5)
    }

    return <><h2>create new</h2>
        <form onSubmit={addNew}>
            <div><input name='anecdote' /></div>
            <button>create</button>
        </form></>
}

const mapDispatchToProps = { addAnecdote, doNotification }
const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm)
//export default AnecdoteForm
export default ConnectedAnecdoteForm