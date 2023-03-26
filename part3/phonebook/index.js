require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

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

app.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(`<p>Phonebook has ${count} people</p> ${new Date()}`);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", morgan("combined"), (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      response
        .status(500)
        .send({ error: "Error deleting person from database" });
    });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  console.log(body);
  if (!body.name || body.number === undefined) {
    return res.status(404).json({
      error: "Content Missing",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "Malformed id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);
