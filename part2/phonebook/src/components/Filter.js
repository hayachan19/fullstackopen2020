import React from 'react'

const Filter = ({value, handleInput}) => {
    return <div>filter shown with <input value={value} onChange={handleInput} /></div>
}

export default Filter