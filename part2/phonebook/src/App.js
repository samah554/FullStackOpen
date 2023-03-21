import { useState, useEffect } from "react";
import contactService from "./services/contacts";

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }
  const className = isError ? "error" : "success";
  return <div className={`notification ${className}`}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setError] = useState(false);

  const hook = () => {
    contactService.getAll().then((res) => {
      setPersons(res.data);
    });
  };

  useEffect(hook, []);

  const handleChange = (event) => {
    const name = event.target.value;
    setNewName(name);
  };

  const handleNumber = (event) => {
    const name = event.target.value;
    setNewNum(name);
  };

  const addContact = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      );
      {
        const updatedPerson = { ...existingPerson, number: newNum };

        contactService
          .update(existingPerson.id, updatedPerson)
          .then((res) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : res.data
              )
            );
            setMessage(`Updated ${newName}`);
            setError(false);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            console.log(error);
            setError(true);
            alert(`Failed to update ${existingPerson.name}'s number.`);
          });
      }
    } else {
      const contact = {
        name: newName,
        number: newNum,
      };
      contactService
        .create(contact)
        .then((res) => {
          setPersons(persons.concat(res.data));
          setMessage(`Added ${newName}`);
          setError(false);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
          setError(true);
          alert(`Failed to add ${newName} to the phonebook.`);
        });
    }
    setNewName("");
    setNewNum("");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      contactService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((entry) => entry.id !== id));
        })
        .catch((err) => {
          console.log(err);
          setError(true);
          setMessage(
            `Information of ${person.name} has been already removed from the server`
          );
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };

  const filterPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main">
      <h1>Phonebook</h1>
      <Notification message={message} isError={isError} />
      <div className="filters">
        <div>
          filter shown with <input onChange={handleSearch} />
        </div>
        <form onSubmit={addContact}>
          <div>
            name: <input onChange={handleChange} value={newName} />
          </div>
          <div>
            number: <input onChange={handleNumber} value={newNum} />
          </div>
          <div>
            <button className="add-btn" type="submit">
              add
            </button>
          </div>
        </form>
      </div>
      <h2>Numbers</h2>
      <hr />
      <div className="numberlist">
        <ul>
          {filterPersons.map((person) => (
            <li key={person.id}>
              {person.name} {person.number}
              <button onClick={() => handleDelete(person.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
