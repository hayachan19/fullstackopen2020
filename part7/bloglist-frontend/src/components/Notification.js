import React from 'react'
import { useSelector } from 'react-redux'
import Alert from 'react-bootstrap/Alert'

const Notification = () => {

  const notification = useSelector(state => state.notification)

  if (notification.content === '') { return null }
  return (
    <Alert variant={notification.type}>
      {notification.content}
    </Alert>
  )
}

export default Notification