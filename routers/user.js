const { promisify } = require('util');
const asyncHandler = require('express-async-handler');
const express = require('express');

const User = require('../models/user');
const Booking = require('../models/booking');
const Cinema = require('../models/cinema');
const Cinemas = require('../models/cinemas');
const Movie = require('../models/movie');
const Showtime = require('../models/showtime');
const Ticket = require('../models/ticket');
const { title } = require('process');

const router = express.Router();

//Code get, post here
//Test http://localhost:3000/
router.get('/', function(req, res) {
    const title = "Test";
    res.render('test/test', { title });
});
router.get('/hello', function(req, res) {
    const title = "Hello";
    res.render('test/hello', { title });
});
router.get('/helloson', function(req, res) {
    const title = "Hello";
    res.render('test/helloSon', { title });
});

module.exports = router