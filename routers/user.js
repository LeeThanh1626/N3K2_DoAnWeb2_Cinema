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
const WishList = require('../models/wishlist');
const { title } = require('process');

const router = express.Router();

//Code get, post here
//Test http://localhost:3000/
//Test
router.get('/hello', function(req, res) {
    const title = "Hello";
    res.render('test/hello', { title });
});
router.get('/helloson', function(req, res) {
    const title = "Hello";
    const name = req.query.name;

    res.render('test/helloSon', { title, name });
});

//Chức năng ND02: thông tin cá nhân
router.get('/profile', asyncHandler(async function(req, res) {
    const profileUser = await User.findByPk(req.session.userId);
    // const noti = req.query.noti;
    res.render('user/profile', { profileUser });
}))

//Chức năng ND03: trang chủ
router.get('/', asyncHandler(async function(req, res) {
    const listMovie = await Movie.findAll();
    const favourite = await WishList.findAll();
    res.render('homepage/homepage', { listMovie, favourite });
}))

//Chức năng ND04: tìm kiếm
router.get('/search', asyncHandler(async function(req, res) {
    res.render('search/search');
}))

router.post('/search', asyncHandler(async function(req, res) {
    //Tìm kiếm theo phim
    const { action, find } = req.body;
    const xfind = find.toLowerCase();
    const listResult = [];
    const listMovie = await Movie.findAll();
    const listCinema = await Cinema.findAll();
    const listCinemas = await Cinemas.findAll();
    if (action === "Movie") {
        listMovie.forEach(movie => {
            const temp = movie.name.toLowerCase();
            if (temp.search(xfind) !== -1) {
                listResult.push(movie);
            }
        })
    }
    if (action === "Cinema") {
        listCinema.forEach(cinema => {
            const temp = cinema.name.toLowerCase();
            if (temp.search(xfind) !== -1) {
                listResult.push(cinema);
            }
        })
    } else {
        listCinemas.forEach(cinemas => {
            const temp = cinemas.name.toLowerCase();
            if (temp.search(xfind) !== -1) {
                listResult.push(cinemas);
            }
        })
    }

    res.render('search/resultSearch', { listResult, action, listCinemas });
}))

router.get('/showtime', asyncHandler(async function(req, res) {
    const listMovie = await Movie.findAll();
    const listShowtime = await Showtime.findAll();
    const list = [];
    const idCinema = req.query.idCinema;
    listShowtime.forEach(showtime => {
        const tempDate = new Date(showtime.start)
        if (showtime.idCinema == idCinema) {
            const exits = list.find(u => u.idMovie === showtime.idMovie);
            if (exits) { //Nếu có tồn tại 
                list.forEach(u => {
                    if (u.idMovie === showtime.idMovie) { //Cập nhật lại số vé và doanh thu
                        const show = tempDate.getHours() + ':' + tempDate.getMinutes();
                        u.start.push(show);
                    }
                })
            } else { //Nếu không tồn tại
                const temp = { //Tạo đối tượng mới 
                    id: showtime.id,
                    idCinema: showtime.idCinema,
                    idMovie: showtime.idMovie,
                    // start: showtime.start.getHour() + ':' + showtime.start.getMinutes(),
                    start: [tempDate.getHours() + ':' + tempDate.getMinutes()],
                }
                list.push(temp); //Thêm vào mảng
            }
        } else {}
    })
    res.render('showtime/showtime', { list, listMovie });
}))

//Chức năng ND05: đặt vé
//Chưa hoàn thành -- Còn đường dẫn đến views
router.get('/booking', asyncHandler(async function(req, res) {
    //Truyền vào id rạp chiếu và id phim
    //Load ngang dọc, showtime => truyền xuống view

    const idCinema = req.query.idCinema;
    const idMovie = req.query.idMovie;
    const idShowtime = req.query.idShowtime;

    const tempShowtime = await Showtime.findByPk(idShowtime);
    console.log(tempShowtime);
    // const idMovie = tempShowtime.idMovie;
    const tempCinema = await Cinema.findByPk(tempShowtime.idCinema);
    // const idCinema = tempCinema.id;

    const ngang = tempCinema.horizontalSize;
    const doc = tempCinema.verticalSize;
    res.render('user/seat', { ngang, doc, idMovie, idCinema });
}))

router.post('/booking', asyncHandler(async function(req, res) {

    const { seat } = req.body //get mảng mã ghế muốn đặt
    console.log(seat);

    res.redirect('/booking');

    // const idUser = "abc"; //iduser trong session
    // const idShowTime = 1; //get
    // const totalMoney = 100000; //showtime.money*listSeat.length

    // //lưu row mới vào bảng booking
    // await Booking.addBooking(idUser, idShowTime, totalMoney);
    // const listBooking = await Booking.findAll();
    // //chạy listSeat lưu vào bảng Ticket
    // // listSeat.forEach(u => {
    // //     const money = 50000; //showtime.money
    // //     await Ticket.addTicket(listBooking.length - 1, u, money);
    // // })
    // for (const u of listSeat) {
    //     const money = 50000; //showtime.money
    //     await Ticket.addTicket(listBooking.length - 1, u, money);
    // }

    // res.redirect('/user/his?noti=bookingSuccess', { noti });
}))

//Chức năng ND06: xem lại danh sách đặt vé trong lịch sử
//Chưa hoàn thành -- Còn đường dẫn đến views
router.get('/history', asyncHandler(async function(req, res) {
    //Lưu vào session biến UserID để dùng
    //const UserID = "session_UserID";
    const UserID = req.session.userId;
    // const profileUser = await User.findByPk(req.session.userId);

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

    console.log(listHis);
    //Truyền thêm listMovie, Cinema, Cinemas để hiển thị cho idMovie và idCinema
    const listMovie = await Movie.findAll();
    const listCinema = await Cinema.findAll();
    const listCinemas = await Cinemas.findAll();

    res.render('user/history', { listHis, listMovie, listCinema, listCinemas });

}));


module.exports = router