import React, { useState, useEffect } from 'react';
import axios from 'axios'

const CountryList = ({ countries, filter }) => {
  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
  if (filteredCountries.length === countries.length || filteredCountries.length === 0) return null //?, starting state?
  if (filteredCountries.length > 10) return <p>Too many matches, specify another filter</p>
  if (filteredCountries.length > 1) return filteredCountries.map(
    country => <p key={country.alpha3Code}>{country.name}</p>
  )
  return <CountryInfo country={filteredCountries[0]} />
}

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${process.env.REACT_APP_OWM_API_KEY}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [country.capital])
  return <div>
    <h1>{country.name}</h1>
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h2>languages</h2>
    <ul>
      {country.languages.map(language => <li key={language.iso639_2}>{language.name}</li>)}
    </ul>
    <img alt={'Flag of ' + country.name} height='200' src={country.flag} />
    <WeatherInfo location={country.capital} weather={weather} />
  </div>
}

const WeatherInfo = ({ location, weather }) => {
  if (weather === null) return <></>
  return <>
    <h2>Weather in {location}</h2>
    <p><b>temperature: </b>{weather.main.temp} Celcius</p>
    <img alt={weather.weather[0].main} src={'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'} />
    <p><b>wind: </b>{weather.wind.speed} km/h <b>direction: </b>{weather.wind.deg} deg</p></>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const handleInputFilter = (event) => { setFilter(event.target.value) }
  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then(response => setCountries(response.data))
  }, [])

  return <div>
    find countries <input value={filter} onChange={handleInputFilter}></input>
    <CountryList countries={countries} filter={filter} />
  </div>
}

export default App;
