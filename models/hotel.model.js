const mongoose = require('mongoose');
const availabilitySchema = new mongoose.Schema({
    start_date: {
        type: String,
        required: true
      },
      end_date: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ["booked", "available"],
        required: true
      }
  })
const roomsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Standard", "Executive", "Deluxe"],
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      availability: [availabilitySchema]
  })

const hotelSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    rooms: [roomsSchema]
  });

  const hotel = mongoose.model('hotel', hotelSchema);
  module.exports = hotel;