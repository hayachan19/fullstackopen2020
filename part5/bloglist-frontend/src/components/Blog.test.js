import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Component testing with react-testing-library',
  author: 'Jest Tester',
  url: 'http://example.com',
  likes: 5,
  user: { name: 'react-testing-user' }
}
const dummy = () => { return 1 }

test('renders content', () => {
  const component = render(
    <Blog blog={blog} likeHandler={() => dummy()} deleteHandler={() => dummy()} loggedUsername='test' />
  )
  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author)
  expect(component.container.querySelector('.toggleable')).toHaveStyle('display: none')
  expect(component.container.querySelector('.blog_url')).not.toBeVisible()
  expect(component.container.querySelector('.blog_likes')).not.toBeVisible()
})

test('shows url and likes when expanded', () => {
  const component = render(
    <Blog blog={blog} likeHandler={() => dummy()} deleteHandler={() => dummy()} loggedUsername='test' />
  )
  const button = component.getByText('view')
  fireEvent.click(button)
  expect(component.container.querySelector('.toggleable')).not.toHaveStyle('display: none')
  expect(component.container.querySelector('.blog_url')).toBeVisible()
  expect(component.container.querySelector('.blog_likes')).toBeVisible()
})

test('clicks like twice', () => {
  const mocker = jest.fn()
  const component = render(
    <Blog blog={blog} likeHandler={mocker} deleteHandler={() => dummy()} loggedUsername='test' />
  )
  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)
  expect(mocker.mock.calls).toHaveLength(2)
})