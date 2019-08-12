require('dotenv').config()
//express
const express = require('express')
const app = express()
//bodyparser
const bodyParser = require('body-parser')
app.use(bodyParser.json())
//models
const Person = require('./models/person')
//morgan
const morgan = require('morgan')
app.use(morgan(function (tokens, req, res) {
  let log = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]
  if (req.method === 'POST' || req.method === 'PUT') {
    log = log.concat(JSON.stringify(req.body))
  }
  return log.join(' ')
}))
//cors
const cors = require('cors')
var corsOptions = {
  origin: '/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
//for production
app.use(express.static('build'))

//GET
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})
//does not work
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person.toJSON())
    } else {
      next()
    }
  }).catch(error => next(error))

})

app.get('/info', (req,res) => {
  const d = new Date()
  d.toString()
  Person.count({}).then(count => {
    res.send('<div>phonebook has info for '+ count +' people.</div><div>'+ d +'</div>')
  })
})

//POST
app.post('/api/persons', (req, res, next) => {
  const p = new Person({
    name: req.body.name,
    number: req.body.number,
    display: true
  })
  p.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  }).catch(err => next(err))

})

//PUT
app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
    display: true
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    }).catch(error => {
      next(error)
    })
})

//DELETE
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(result => {
    if (result) {
      res.status(204).end()
    } else {
      next()
    }
  }).catch(error => next(error))
})

//ERRORS
//404
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
//400
const errorHandler = (err, req, res, next) => {
  console.error(err)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)


//PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
