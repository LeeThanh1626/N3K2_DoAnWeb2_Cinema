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
//Test
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
    const name = req.query.name;

    res.render('test/helloSon', { title, name });
});

//Chức năng ND03: trang chủ
router.get('/', asyncHandler(async function(req, res) {
    const listMovie = await Movie.findAll();
    res.render('user/homepage', { listMovie });
}))

//Chức năng ND05: đặt vé
//Chưa hoàn thành -- Còn đường dẫn đến views
router.get('/booking', asyncHandler(async function(req, res) {
    //Truyền vào id rạp chiếu và id phim
    //Load ngang dọc, showtime => truyền xuống view
    res.render('');
}))

router.post('booking', asyncHandler(async function(req, res) {

    const listSeat = ["A1", "A2"]; //get mảng mã ghế muốn đặt

    const idUser = "abc"; //iduser trong session
    const idShowTime = 1; //get
    const totalMoney = 100000; //showtime.money*listSeat.length

    //lưu row mới vào bảng booking
    await Booking.addBooking(idUser, idShowTime, totalMoney);

    //chạy listSeat lưu vào bảng Ticket
    listSeat.forEach(u => {
        const listBooking = await Booking.findAll();
        const money = 50000; //showtime.money
        await Ticket.addTicket(listBooking.length - 1, u, money);
    })
    const listBooking = await Booking.findAll();
    //chạy listSeat lưu vào bảng Ticket
    // listSeat.forEach(u => {
    //     const money = 50000; //showtime.money
    //     await Ticket.addTicket(listBooking.length - 1, u, money);
    // })
    for (const u of listSeat) {
        const money = 50000; //showtime.money
        await Ticket.addTicket(listBooking.length - 1, u, money);
    }

    res.redirect('/user/his?noti=bookingSuccess', { noti });
}))

//Chức năng ND06: xem lại danh sách đặt vé trong lịch sử
//Chưa hoàn thành -- Còn đường dẫn đến views
router.get('/his', asyncHandler(async function(req, res) {
    //Lưu vào session biến UserID để dùng
    const UserID = "session_UserID";

    //Tạo list lưu dữ liệu dòng gồm: ngày/giờ, phim, rạp/cụm rạp, ghế
    const listHis = [];

    const listTicket = await Ticket.findAll();
    const listBooking = await Booking.findAll();
    const listShowtime = await Showtime.findAll();

    //Kiểm tra xem vé có thuộc người dùng không
    listTicket.forEach(tempTicket => {
        listBooking.forEach(tempBooking => { //Ghép với bảng booking để lấy showtime
            if (tempTicket.idBooking === tempBooking.id && tempBooking.idUser === UserID) {
                listShowtime.forEach(tempShowtime => { //ghép với bảng showtime để lấy idMovie và idCinema
                    if (tempBooking.idShowTime === tempShowtime.id) {
                        const temp = {
                            date: tempBooking.datetime, //Lưu ngày/giờ
                            movie: tempShowtime.idMovie, //Lưu idMovie
                            cinema: tempShowtime.idCinema, //Lưu idCinema
                            seat: tempTicket.idSeat, //Lưu mã ghế
                        }
                        listHis.push(temp);
                    }
                })
            }
        })
    })

    //Truyền thêm listMovie, Cinema, Cinemas để hiển thị cho idMovie và idCinema
    const listMovie = await Movie.findAll();
    const listCinema = await Cinema.findAll();
    const listCinemas = await Cinemas.findAll();

    res.render('', { listHis, listMovie, listCinema, listCinemas });

}));


module.exports = router