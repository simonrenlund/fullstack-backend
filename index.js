const express = require('express')

app = express()

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

app.get('api/persons/:id', (req, res) => {
  /*const id = Number(req.params.id)
  const person = persons.filter(person => person.id !== id)
  res.send('<div>'+id+'</id>')
  if (person) {
    res.json(person)
  } else {
    //res.status(404).end()
  }*/
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
