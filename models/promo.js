const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the promos schema constructor to map mongoDB collection and define the shape of the documents within the collection
const promoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    // Ref pointing to the User model
    ref: 'User',
  },
});

module.exports = mongoose.model('Promo', promoSchema);
