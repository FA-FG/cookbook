// require moongoose
// allow us to create schema for consistnsy
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    require: true
  },
},{
  // createdAt adn updatedAt time
  timsestamps: true 
})

const User = mongoose.model('User', userSchema)
module.exports = User
