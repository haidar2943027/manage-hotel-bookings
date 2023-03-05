class BookingsHandler {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }

    async createBooking(request, h) {
        try {
            let params = {
                fromDate: request.payload.checkInDate.toISOString().slice(0,10),
                toDate: request.payload.checkOutDate.toISOString().slice(0,10) }
            const checkRoomAvailability = await this.bookingsService.getHotels(params);
            console.log(checkRoomAvailability["data"])
            if (checkRoomAvailability && checkRoomAvailability["data"] && checkRoomAvailability["data"].length > 0) {
                const booking = await this.bookingsService.createBooking(request.payload);
                return h.response(booking).code(201);
            } else {
                return h.response({ message: `No room available from ${params.fromDate} to ${params.toDate}`, data: {}, statusCode: 400 }).code(400);
            }
        } catch (err) {
            h.response({ message: err.message, data: {}, statusCode: 400 }).code(400);
        }
    }

    async getHotels(request, h, params) {
        try {
            const hotels = await this.bookingsService.getHotels(request.query);
            return h.response(hotels).code(200);
        } catch (err) {
            h.response({ message: err.message, data: {} }).code(400);
        }
    }

    async getBookingById(request, h) {
        try {
            const booking = await this.bookingsService.getBookingById(request.params.id);
            if (!booking) {
                return h.response().code(404);
            }
            return h.response(booking).code(200);
        } catch (err) {
            h.response({ message: err.message, data: {} }).code(400);
        }
    }

    async updateBooking(request, h) {
        try {
            const booking = await this.bookingsService.updateBooking(request.params.id, request.payload);
            if (!booking) {
                return h.response().code(404);
            }
            return h.response(booking).code(200);
        } catch (err) {
            h.response({ message: err.message, data: {} }).code(400);
        }
    }

    async deleteBooking(request, h) {
        try {
            const booking = await this.bookingsService.deleteBooking(request.params.id);
            if (!booking) {
                return h.response().code(404);
            }
            return h.response(booking).code(204);
        } catch (err) {
            h.response({ message: err.message, data: {} }).code(400);
        }
    }
}

module.exports = BookingsHandler;
