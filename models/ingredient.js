const mongoose = require('mongoose');

// Define the Ingredient Schema
const ingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

// Create the Ingredient model from the schema
const Ingredient = mongoose.model('Ingredient', ingSchema);

// Export the Ingredient model
module.exports = Ingredient;
