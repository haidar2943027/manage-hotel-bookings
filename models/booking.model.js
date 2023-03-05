const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    hotelId: {
      type: String,
      required: true
    },
    roomId: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    checkInDate: {
      type: Date,
      required: true
    },
    checkOutDate: {
      type: Date,
      required: true
    },
    roomType: {
      type: String,
      required: true
    },
    numberOfGuests: {
      type: Number,
      required: true
    },
  });

  const booking = mongoose.model('booking', bookingSchema);
  module.exports = booking;