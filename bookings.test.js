const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const BookingsService = require('./services/bookings');
const mongoose = require('mongoose');
chai.use(chaiHttp);
mongoose.connect('mongodb://localhost/hotel-bookings', { useNewUrlParser: true, useUnifiedTopology: true });
const host = "http://localhost:3000"
const bookingsService = new BookingsService();
// Set up mock bookings data
const params = {
    fromDate: "2022-05-01",
    toDate: "2022-05-05"
}
const mockBookings = [
    {
        "_id" : "6402832a789bba7d60da51ec",
        "name" : "haidar",
        "hotelId" : "2",
        "roomId" : "201",
        "email" : "haidar@gmail.com",
        "phone" : "8768687688",
        "checkInDate" : "2022-05-01T00:00:00.000+0000",
        "checkOutDate" : "2022-05-01T00:00:00.000+0000",
        "roomType" : "Standard",
        "numberOfGuests" :2,
        "__v" : 0
    },
    {
        "_id" : "64028728e06cb2e9975db767",
        "name" : "haidar",
        "hotelId" : "2",
        "roomId" : "201",
        "email" : "haidar@gmail.com",
        "phone" : "8768687688",
        "checkInDate" : "2022-05-01T00:00:00.000+0000",
        "checkOutDate" : "2022-05-05T00:00:00.000+0000",
        "roomType" : "Standard",
        "numberOfGuests" : 2,
        "__v" : 0
    },
];

// Set up test data
const testBooking = {
    name: 'Test',
    hotelId: "2",
    roomId: "201",
    email: 'testbooking_1@example.com',
    phone: "8798798798",
    checkInDate: '2022-05-01',
    checkOutDate: '2022-05-05',
    roomType: 'standard',
    numberOfGuests: 3
};
let convertDateFormate = function(dateString){
    const date = new Date(dateString);
    const isoDateString = date.toISOString();
    return isoDateString
}
describe('BookingsHandler', () => {
    describe('createBooking', () => {
        it('should create a new booking', async () => {
            const res = await chai
                .request(host)
                .post('/bookings')
                .send(testBooking);
            expect(res.body.statusCode).to.have.equal(201);
            expect(res.body.data).to.have.property('_id');
            expect(res.body.data.hotelId).to.equal(testBooking.hotelId);
            expect(res.body.data.roomId).to.equal(testBooking.roomId);
            expect(res.body.data.name).to.equal(testBooking.name);
            expect(res.body.data.phone).to.equal(testBooking.phone);
            expect(res.body.data.email).to.equal(testBooking.email);
            expect(res.body.data.checkInDate).to.equal(convertDateFormate(testBooking.checkInDate));
            expect(res.body.data.checkOutDate).to.equal(convertDateFormate(testBooking.checkOutDate));
            expect(res.body.data.roomType).to.equal(testBooking.roomType);
            expect(res.body.data.numberOfGuests).to.equal(testBooking.numberOfGuests);
        });
    });

    describe('getHotels', () => {
        it('should return all available hotels', async () => {
            const res = await chai
                .request(host)
                .get(`/hotels?fromDate=${params["fromDate"]}&toDate=${params["toDate"]}`);
            expect(res.body.statusCode).to.have.equal(200);
            expect(res.body.data.length).to.have.greaterThan(0);
        });
    });

    describe('getBookingById', () => {
        it('should return a booking by ID', async () => {
            const id = mockBookings[0]._id;
            const res = await chai
                .request(host)
                .get(`/bookings/${id}`);
            expect(res.body.statusCode).to.have.equal(200);
            expect(res.body.data._id).to.equal(id);
        });
    })
});

describe('BookingsService', () => {
    describe('createBooking', () => {
        it('should create a new booking', async () => {
            const res = await bookingsService.createBooking(testBooking);
            expect(res.data).to.have.property('_id');
            expect(res.data.hotelId).to.equal(testBooking.hotelId);
            expect(res.data.roomId).to.equal(testBooking.roomId);
            expect(res.data.name).to.equal(testBooking.name);
            expect(res.data.phone).to.equal(testBooking.phone);
            expect(res.data.email).to.equal(testBooking.email);
            expect(convertDateFormate(new Date(res.data.checkInDate))).to.equal(convertDateFormate(testBooking.checkInDate));
            expect(convertDateFormate(new Date(res.data.checkOutDate))).to.equal(convertDateFormate(testBooking.checkOutDate));
            expect(res.data.roomType).to.equal(testBooking.roomType);
            expect(res.data.numberOfGuests).to.equal(testBooking.numberOfGuests);
        });
    });

    describe('getHotels', () => {
        it('should return all hotels', async () => {
            const res = await bookingsService.getHotels(params);
            expect(res.data.length).to.have.greaterThan(0);
        });
    });

    describe('getBookingById', () => {
        it('should return a booking by ID', async () => {
            const bookingId = mockBookings[0]._id;
            const res = await bookingsService.getBookingById(bookingId);
            expect(res.data._id.toString()).to.equal(bookingId);
        });

        it('should return undefined for a non-existent ID', async() => {
            const res = await bookingsService.getBookingById(999);
            expect(res.data).to.be.undefined;
        });
    });

    describe('updateBooking', () => {
        it('should update a booking', async () => {
            const bookingId = mockBookings[0]._id;
            const updatedBooking = {
                hotelId: "2",
                roomId: "202",
                name: 'Updated',
                phone: '98797897987',
                email: 'updatedbooking@example.com',
                checkInDate: '2022-03-01',
                checkOutDate: '2022-03-05',
                roomType: 'deluxe',
                numberOfGuests: 3
            };
            const res = await bookingsService.updateBooking(bookingId, updatedBooking);
            expect(res.statusCode).to.have.equal(200);
            expect(res.data).to.have.property('_id');
            expect(res.data.hotelId).to.equal(updatedBooking.hotelId);
            expect(res.data.roomId).to.equal(updatedBooking.roomId);
            expect(res.data.name).to.equal(updatedBooking.name);
            expect(res.data.phone).to.equal(updatedBooking.phone);
            expect(res.data.email).to.equal(updatedBooking.email);
            expect(convertDateFormate(new Date(res.data.checkInDate))).to.equal(convertDateFormate(updatedBooking.checkInDate));
            expect(convertDateFormate(new Date(res.data.checkOutDate))).to.equal(convertDateFormate(updatedBooking.checkOutDate));
            expect(res.data.roomType).to.equal(updatedBooking.roomType);
            expect(res.data.numberOfGuests).to.equal(updatedBooking.numberOfGuests);
        });

        it('should return undefined for a non-existent ID', async () => {
            const updatedBooking = {
                name: 'Ali',
                phone: '8797979879',
                email: 'updatedbookings@example.com',
                checkInDate: '2022-03-01',
                checkOutDate: '2022-03-05',
                roomType: 'deluxe'
            };
            const res = await bookingsService.updateBooking(999, updatedBooking);
            expect(res.data).to.be.undefined;
        });
    });

    describe('deleteBooking', () => {
        it('should delete a booking', async () => {
            const bookingId = mockBookings[1]._id;
            const res = await bookingsService.deleteBooking(bookingId);
            const result = await bookingsService.getBookingById(bookingId)
            expect(result.data).to.be.undefined;
        });
    })
})
