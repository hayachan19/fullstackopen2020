import React from 'react'

const Header = ({ course }) => (<h2>{course.name}</h2>)

const Part = ({ part }) => (<p>{part.name} {part.exercises}</p>)

const Content = ({ course }) => (course.parts.map(part => <Part key={part.id} part={part} />))

const Total = ({ course }) => (<b>total of {course.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</b>)

const Course = ({ course }) => (<>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
</>
)

export default Course