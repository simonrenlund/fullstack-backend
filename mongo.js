const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('insufficient amount of arguments.')
  process.exit(1)
} else {
  const password = process.argv[2]
  const url =`mongodb+srv://fullstack:${password}@fullstackcluster-1hy1i.mongodb.net/phonebook?retryWrites=true&w=majority`
  mongoose.connect(url, { useNewUrlParser: true })

  const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
    display: Boolean
  })
  const Number = mongoose.model('Number', phonebookSchema)

  if (process.argv.length === 3){
    //print the db
    Number.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(number => {
        console.log(number.name,' ',number.number)
      })
      mongoose.connection.close()
    })
  } else if (process.argv.length === 5) {
    //add an entry
    const name = process.argv[3]
    const number = process.argv[4]

    const num = new Number({
      name: name,
      number: number,
      display: true
    })

    num.save().then( () => {
      console.log('added ',name, ' number ', number,' to phonebook')
      mongoose.connection.close()
    })

  } else {
    console.log('insufficient amount of arguments.')
    mongoose.connection.close()
  }
}
