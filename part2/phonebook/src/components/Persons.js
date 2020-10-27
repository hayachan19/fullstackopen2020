import React from 'react'

const Persons = ({list, filter, handleClickRemove}) => {
    return list.filter(
        person => person.name.toLowerCase()
        .includes(filter.toLowerCase()))
        .map(person => <p key={person.name}>{person.name} {person.number}<button onClick={()=>handleClickRemove(person.name)}>delete</button></p>)
}

export default Persons