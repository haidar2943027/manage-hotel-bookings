// Set up bookings service and handler
const Joi = require('joi');
const BookingsHandler = require('../handlers/bookings');
const BookingsService = require('../services/bookings');
const bookingsService = new BookingsService();
const bookingsHandler = new BookingsHandler(bookingsService);

module.exports = [
    {
        method: 'GET',
        path: '/hotels',
        options: {
            handler: bookingsHandler.getHotels.bind(bookingsHandler),
            validate: {
                query: Joi.object({
                    fromDate: Joi.string().required().description("Date formate YYYY-MM-DD, e.g 2022-05-01"),
                    toDate: Joi.string().required().description("YYYY-MM-DD e.g 2022-05-05")
                })
            },
            tags: ['api', 'hotels'],
            description: 'Get all hotels'
    }
    },
    { 
      method: 'POST',
      path: '/bookings',
      options: {
          handler: bookingsHandler.createBooking.bind(bookingsHandler),
          validate: {
              payload: Joi.object({
                hotelId: Joi.string().required().description("1 and 2"),
                roomId: Joi.string().required().description("101, 102 and 201, 202"),
                  name: Joi.string().required(),
                  email: Joi.string().email().required(),
                  phone: Joi.string().required(),
                  checkInDate: Joi.date().required(),
                  checkOutDate: Joi.date().required(),
                  roomType: Joi.string().required(),
                  numberOfGuests: Joi.number().integer().min(1).max(10).required()
              })
          },
          tags: ['api', 'bookings'],
          description: 'Create a new booking'
      }
  },
  {
      method: 'GET',
      path: '/bookings/{id}',
      options: {
          handler: bookingsHandler.getBookingById.bind(bookingsHandler),
          validate: {
              params: Joi.object({
                  id: Joi.string().required()
              })
          },
          tags: ['api', 'bookings'],
          description: 'Get a booking by ID'
      }
  },
  {
      method: 'PUT',
      path: '/bookings/{id}',
      options: {
          handler: bookingsHandler.updateBooking.bind(bookingsHandler),
          validate: {
              params: Joi.object({
                  id: Joi.string().required()
              }),
              payload: Joi.object({
                  htelId: Joi.string().description("1 and 2"),
                  roomId: Joi.string().description("101, 102 and 201, 202"),
                  name: Joi.string(),
                  email: Joi.string().email(),
                  phone: Joi.string(),
                  checkInDate: Joi.date(),
                  checkOutDate: Joi.date(),
                  roomType: Joi.string(),
                  numberOfGuests: Joi.number().integer().min(1).max(10)
              })
          },
          tags: ['api', 'bookings'],
          description: 'Update a booking by ID'
      }
  },
  {
      method: 'DELETE',
      path: '/bookings/{id}',
      options: {
          handler: bookingsHandler.deleteBooking.bind(bookingsHandler),
          validate: {
              params: Joi.object({
                  id: Joi.string().required()
              })
          },
          tags: ['api', 'bookings'],
          description: 'Cancel a booking by ID'
      }
  }
]