import React from 'react'

const PersonForm = ({ name, number, handleInputName, handleInputNumber, handleClickSubmit }) => {
    return <form>
        <div>name: <input value={name} onChange={handleInputName} /></div>
        <div>number: <input value={number} onChange={handleInputNumber} /></div>
        <div><button type="submit" onClick={handleClickSubmit}>add</button></div>
    </form>
}

export default PersonForm