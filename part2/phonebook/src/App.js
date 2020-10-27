import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationText, setNotificationText] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const handleInputNewName = (event) => (setNewName(event.target.value))
  const handleInputNewNumber = (event) => (setNewNumber(event.target.value))
  const handleInputFilter = (event) => (setFilter(event.target.value))
  const handleClickSubmit = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personId = persons.find(person => person.name === newName).id
        personService.update(personId, newPerson).then(data => {
          setPersons(persons.map(person => person.id === data.id ? data : person))
          setNewName('')
          setNewNumber('')
        })
          .catch(error => {
            setNotificationText(`Information of ${newPerson.name} has already been removed from server`)
            setNotificationType('error')
            setTimeout(() => { setNotificationText(null) }, 5000)
          })
      }
      return
    }
    personService.create(newPerson).then(data => {
      setPersons(persons.concat(data))
      setNewName('')
      setNewNumber('')
      setNotificationText(`Added ${data.name}`)
      setNotificationType('success')
      setTimeout(() => { setNotificationText(null) }, 5000)
    })
  }
  const handleClickRemove = (name) => {
    if (window.confirm(`Delete ${name}?`)) {
      const personToDelete = persons.find(person => person.name === name)
      personService.remove(personToDelete.id)
        .then(setPersons(persons.filter(person => person.id !== personToDelete.id)))

    }
  }
  useEffect(() => {
    personService.getAll().then(data => setPersons(data))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification text={notificationText} type={notificationType} />
      <Filter value={filter} handleInput={handleInputFilter} />
      <h3>Add a new</h3>
      <PersonForm name={newName} number={newNumber}
        handleInputName={handleInputNewName} handleInputNumber={handleInputNewNumber}
        handleClickSubmit={handleClickSubmit} />
      <h3>Numbers</h3>
      <Persons list={persons} filter={filter} handleClickRemove={handleClickRemove} />
    </div>
  )
}

export default App