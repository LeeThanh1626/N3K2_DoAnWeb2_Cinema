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

const router = express.Router();

//Code get, post here
router.get('/', function(req, res) {

});


//Chức năng QL02
//Hiển thị trang quản lý rạp và cụm rạp
//Chưa hoàn thành -- Còn đường dẫn đến views
router.get('/manageCinema', asyncHandler(async function(req, res) {
    const listCinema = await Cinema.findAll();
    const listCinemas = await Cinemas.findAll();

    res.render('', { listCinema, listCinemas });
}))

//Thêm, xóa, sửa Cinemas, Cinema, Movie, Showtime
router.post('/manageCinema', asyncHandler(async function(req, res) {
    const action = req.query.action;
    const id = req.query.id;

    if (action === "addCinema") { //Thêm rạp chiếu
        const name = req.query.name;
        const idCinemas = req.query.idCinemas;
        const horizontalSize = req.query.horizontalSize;
        const verticalSize = req.query.verticalSize;
        await Cinema.addCinema(name, idCinemas, horizontalSize, verticalSize);
    } else if (action === "deleteCinema") { //Xóa rạp chiếu
        await Cinema.deleteCinema(id);
    } else if (action === "updateCinema") { //Cập nhật rạp chiếu
        const name = req.query.name;
        const idCinemas = req.query.idCinemas;
        const horizontalSize = req.query.horizontalSize;
        const verticalSize = req.query.verticalSize;
        await Cinema.updateCinema(id, name, idCinemas, horizontalSize, verticalSize);
    } else if (action === "addCinemas") { //Thêm cụm rạp
        const name = req.query.name;
        const address = req.query.address;
        await Cinemas.addCinemas(name, address);
    } else if (action === "deleteCinemas") { //Xóa cụm rạp
        await Cinemas.deleteCinemas(id);
    } else if (action === "updateCinemas") { //Cập nhật cụm rạp
        const name = req.query.name;
        const address = req.query.address;
        await Cinemas.updateCinemas(id, name, address);
    }

    //render lại danh sách cụm rạp và rạp
    res.redirect('/admin/manageCinema');
}))

//Hiển thị trang quản lý phim và xuất chiếu
//Chưa hoàn thành -- Còn đường dẫn đến views
router.get('/manageMovie', asyncHandler(async function(req, res) {
    const listMovie = await Movie.findAll();
    const listShowtime = await Showtime.findAll();

    res.render('', { listMovie, listShowtime });
}))

router.post('/mangageMovie', asyncHandler(async function(req, res) {
    const action = req.query.action;
    const id = req.query.id;

    if (action === "addCinema") { //Thêm phim
        //name, openingDay, poster, time
        const name = req.query.name;
        const openingDay = req.query.openingDay;
        const poster = req.query.poster;
        const time = req.query.time;
        await Cinema.addCinema(name, openingDay, poster, time);
    } else if (action === "deleteCinema") { //Xóa phim
        await Cinema.deleteCinema(id);
    } else if (action === "updateCinema") { //Cập nhật phim
        const name = req.query.name;
        const openingDay = req.query.openingDay;
        const poster = req.query.poster;
        const time = req.query.time;
        await Cinema.updateCinema(id, name, openingDay, poster, time);
    } else if (action === "addCinemas") { //Thêm xuất chiếu
        const idCinema = req.query.idCinema;
        const idMovie = req.query.idMovie;
        const start = req.query.start;
        const finish = req.query.finish;
        const money = req.query.money;
        await Cinemas.addCinemas(idCinema, idMovie, start, finish, money);
    } else if (action === "deleteCinemas") { //Xóa xuất chiếu
        await Cinemas.deleteCinemas(id);
    } else if (action === "updateCinemas") { //Cập nhật xuất chiếu
        const idCinema = req.query.idCinema;
        const idMovie = req.query.idMovie;
        const start = req.query.start;
        const finish = req.query.finish;
        const money = req.query.money;
        await Cinemas.updateCinemas(id, idCinema, idMovie, start, finish, money);
    }

    //render lại trang quản lý phim và xuất chiếu
    res.require('/admin/manageMovie');
}))


//Chức năng QL03


module.exports = router