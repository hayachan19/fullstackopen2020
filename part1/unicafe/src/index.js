import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ text, handleClick }) => (<button onClick={handleClick}>{text}</button>)

const Statistic = ({ text, value }) => (<tr><td>{text}</td><td>{value}</td></tr>)

const Statistics = ({ good, neutral, bad }) => {
  if (good === 0 && neutral === 0 && bad === 0) return <p>No feedback given</p>
  return <table><tbody>
    <Statistic text='good' value={good} />
    <Statistic text='neutral' value={neutral} />
    <Statistic text='bad' value={bad} />
    <Statistic text='all' value={good + neutral + bad} />
    <Statistic text='average' value={(good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad)} />
    <Statistic text='positive' value={(good / (good + neutral + bad)) * 100+'%'} />
    </tbody></table>
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' handleClick={() => setGood(good + 1)}></Button>
      <Button text='neutral' handleClick={() => setNeutral(neutral + 1)}>neutral</Button>
      <Button text='bad' handleClick={() => setBad(bad + 1)}>bad</Button>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)