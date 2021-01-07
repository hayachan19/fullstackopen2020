import React from 'react'
//import { useDispatch } from 'react-redux'
import { connect } from 'react-redux'
import { changeFilter } from '../reducers/filterReducer'

const Filter = (props) => {
    //const dispatch = useDispatch()
    const handleChange = (event) => {
        // input-field value is in variable event.target.value
        //dispatch(changeFilter(event.target.value))
        props.changeFilter(event.target.value)
    }
    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} />
        </div>
    )
}

const mapDispatchToProps = { changeFilter }
const ConnectedFilter = connect(null, mapDispatchToProps)(Filter)
//export default Filter
export default ConnectedFilter