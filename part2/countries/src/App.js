import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [matchingCountries, setMatchingCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      setCountries(res.data);
    });
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setMatchingCountries([]);
      return;
    }

    const newMatchingCountries = countries.filter((country) => {
      const name = country.name.common.toLowerCase();
      return name.includes(searchQuery.toLowerCase());
    });

    if (newMatchingCountries.length > 10) {
      setMessage("Please make your query more specific");
      setMatchingCountries([]);
    } else if (newMatchingCountries.length === 1) {
      setMatchingCountries([]);
    } else {
      setMatchingCountries(newMatchingCountries);
      setMessage("");
    }
  }, [searchQuery, countries]);

  const handleSearch = (e) => {
    const cts = e.target.value;
    setCount(cts.length + 1);
    return setSearchQuery(cts);
  };

  const width = {
    height: "200px",
    width: "200px",
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for a country"
      />

      {matchingCountries.length > 0 ? (
        matchingCountries.map((country) => (
          <div key={country.cca3}>
            <h2>{country.name.common}</h2>
            <img
              style={width}
              src={country.flags.svg}
              alt={`${country.name.common} syflag`}
            />
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area} km²</p>
            <h3>Languages</h3>
            <ul>
              {Object.values(country.languages).map((language, i) => (
                <li key={i}>{language}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>{{ count } < 3 ? { message } : "No countries found"}</p>
      )}
    </div>
  );
}

export default App;
