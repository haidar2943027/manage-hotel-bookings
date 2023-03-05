const booking = require('../models/booking.model');
const hotel = require('../models/hotel.model');

class BookingsService {
    constructor() {
        this.bookings = booking;
        this.hotels = hotel;
    }

    async createBooking(bookingData) {
        try {
            this.bookings = booking;
            // Create booking logic
            const newBooking = await this.bookings.create(bookingData);
            return { message: "Booking created successfully.", data: newBooking, statusCode: 201};
        } catch (err) {
            return { message: err.message, statusCode: 400 };
        }
    }

    async getHotels(params) {
        try {
            // Get hotels list with date filter
            console.log('parm===', params)
            let startDate = params["fromDate"]
            let endDate = params["toDate"]
            console.log("startDate", startDate)
            let match = [
                {
                  $match: {
                    'rooms.availability': {
                      $elemMatch: {
                        status: 'available',
                        start_date: { $gte: startDate },
                        end_date: { $lte: endDate }
                      }
                    }
                  }
                },
                {
                  $project: {
                    '_id': 0,
                    'id': 1,
                    'name': 1,
                    'location': 1,
                    'rooms': {
                      $map: {
                        input: '$rooms',
                        as: 'room',
                        in: {
                          id: "$$room.id",
                          type: "$$room.type",
                          price: "$$room.price",
                          availability: {
                            $filter: {
                              input: '$$room.availability',
                              as: 'availability',
                              cond: {
                                $and: [
                                  {
                                    $eq: ['$$availability.status', "available"]
                                  },
                                  {
                                    $gte: ['$$availability.start_date', startDate]
                                  },
                                  {
                                    $lte: ['$$availability.end_date', endDate]
                                  }
                                ]
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                { // run to remove empty availability object from the response.
                    $project: {
                        'name': 1,
                        'id': 1,
                        'location': 1,
                        'rooms': {
                            $filter: {
                            input: '$rooms',
                            as: 'room',
                            cond: { $ne: [{ $size: '$$room.availability' }, 0] }
                            }
                        },
                    }
                }
              ]
            const allHotels =  await this.hotels.aggregate(match)
            return { message: "Hotels list get successfully.", data: allHotels, statusCode: 200};;
        } catch(err) {
            return { message: err.message, statusCode: 400 };
        }
    }

    async getBookingById(id) {
        try {
            // Get the booking by ID
            const booking = await this.bookings.findOne({ "_id" : id});
            if(!booking) {
                return { message: "No booking available.", statusCode: 400 };
            }
            return { message: "Booking details get successfully.", data: booking, statusCode: 200};
        } catch (err) {
            return { message: err.message, statusCode: 400 };
        }
    }

    async updateBooking(id, bookingData) {
        try {
            // Update the booking
            let query = {_id : id}
            let booking = await this.bookings.findOneAndUpdate(query, bookingData);
            return { message: "Successfully Updated..", data: booking, statusCode: 200};
        } catch (err) {
            return { message: err.message, statusCode: 400 };
        }
    }

    async deleteBooking(id) {
        try {
            // Delete/Cancel the booking
            let data = await this.bookings.findByIdAndDelete(id)
            return { message: "Booking deleted successfully.", data: data, statusCode: 200};
        } catch (err) {
            return { message: err.message, statusCode: 400 };
        }
    }
}
module.exports = BookingsService;