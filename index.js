const express = require('express')
app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const morgan = require('morgan')
app.use(morgan(function (tokens, req, res) {
  let log = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]
  if (req.method === 'POST') {
    log = log.concat(JSON.stringify(req.body))
  }
  return log.join(' ')
}))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
    display: true
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    display: true
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
    display: true
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    display: true
  }
]

//notes stuff
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/notes', (req, res) => {
  res.json(notes)
})

app.get('/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
})

//phonebook
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.filter(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  let error = 0
  if (!req.body.name || !req.body.number) {
    error = 1
    res.status(404).json({
      error: 'content missing'
    })
  }
  for (let i=0;i<persons.length;i++) {
    if (persons[i].name === req.body.name) {
      error = 1
      res.status(400).json({
        error: 'name must be unique'
      })
    }
  }
  //if (error === 0) {
    const id = Math.floor(Math.random()*10000)
    const person = {
      id: id,
      name: req.body.name,
      number: req.body.number
    }
    persons = persons.concat(person)
    res.json(person)
    //res.send('<div>'+ person.name + ' with number ' + person.number + ' was added successfully!')
  //}

})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})


app.get('/info', (req,res) => {
  const d = new Date()
  d.toString()
  console.log(d)
  const amount = persons.length
  res.send(
    '<div>Phonebook has info for '+ amount +' people.</div><div>'+ d + '</div>'
  )
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
