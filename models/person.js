const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useFindAndModify', false)
//connection
const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//schema
const phonebookSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  number: {type: String, required: true},
  display: Boolean
})
phonebookSchema.plugin(uniqueValidator)
//for frontend
phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//export
module.exports = mongoose.model('Person', phonebookSchema)
