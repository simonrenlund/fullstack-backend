const mongoose = require('mongoose')
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
  name: String,
  number: String,
  display: Boolean
})
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
