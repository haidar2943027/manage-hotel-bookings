const Hapi = require('@hapi/hapi');
const swagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const routes = require('./routes/bookings');
const mongoose = require('mongoose');
const hotel = require('./models/hotel.model');
const { MongoClient, ServerApiVersion } = require('mongodb');
async function connectToDB() {
    try {
        // await mongoose.connect('mongodb://localhost/hotel-bookings', { useNewUrlParser: true });
        await mongoose.connect('mongodb+srv://haidarali030492:GvNPUFleVOkquf7p@cluster0.te34tzy.mongodb.net/booking', { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});
        console.log('Connected to Database');
    } catch (error) {
      console.log(error);
    }
  }
async function init() {

    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: 'localhost'
    });
    await connectToDB();
    // Register routes
    server.route(routes);
    const swaggerOptions = {
        
        info: {
            title: 'Hotel Bookings API',
            version: '1.0.0',
            contact: {
                name: "Haider Ali",
                email: "haidar.ali030492@gmail.com"
            }
        }
    };
    await server.register([
        Inert,
        Vision,
        {
            plugin: swagger,
            options: swaggerOptions
        }
    ]);

    // Start the server
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
}

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();