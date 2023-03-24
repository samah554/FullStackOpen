const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const generateId = () => {
  const min = 100000;
  const max = 999999;
  let newId = Math.floor(Math.random() * (max - min + 1)) + min;

  while (persons.find((person) => person.id === newId)) {
    newId = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return newId;
};

const logFormat = '":method :url" :status :response-time ms :body';
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(logFormat));

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("build"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has ${persons.length} people</p> ${new Date()}`);
});

app.get("/api/persons", morgan("combined"), (req, res) => {
  res.send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", morgan("common"), (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(404).json({
      error: "Content Missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
  console.log(persons);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
