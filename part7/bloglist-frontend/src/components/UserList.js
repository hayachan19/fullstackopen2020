import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
const UserList = () => {
  const users = useSelector(state => state.users)

  return (<>
  <h2>users</h2>
    <Table bordered hover size="sm">
      <thead>
        <tr>
          <td></td>
          <td><b>blogs created</b></td>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}><td><Link to={`users/${user.id}`}>{user.name}</Link></td><td>{user.blogs.length}</td></tr>
        ))}
      </tbody>
    </Table>
  </>)
}

export default UserList