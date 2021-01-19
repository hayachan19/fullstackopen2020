import React from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/loginReducer'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
const LoginForm = () => {
    const dispatch = useDispatch()
    const handleFormLogin = async (event) => {
        event.preventDefault()
        dispatch(loginUser(event.target.username.value, event.target.password.value))
    }

    return (<Form onSubmit={handleFormLogin}>
        <Form.Label>username</Form.Label>
        <Form.Control name='username' />
        <Form.Label>password</Form.Label>
        <Form.Control type='password' name='password' />
        <Button id="login" type="submit">login</Button>
    </Form>)
}

export default LoginForm