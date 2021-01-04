import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

const blog = {
  title: 'Component testing with react-testing-library',
  author: 'Jest Tester',
  url: 'http://example.com',
  likes: 5,
  user: { name: 'react-testing-user' }
}
test('renders content', () => {
  const mocker = jest.fn()
  const component = render(
    <BlogForm createHandler={mocker} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, { target: { value: blog.title } })
  fireEvent.change(author, { target: { value: blog.author } })
  fireEvent.change(url, { target: { value: blog.url } })
  fireEvent.submit(form)

  expect(mocker.mock.calls).toHaveLength(1)
  expect(mocker.mock.calls[0][0].title).toBe(blog.title)
  expect(mocker.mock.calls[0][0].author).toBe(blog.author)
  expect(mocker.mock.calls[0][0].url).toBe(blog.url)
})
