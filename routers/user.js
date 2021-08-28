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
    const noti = req.query.noti;
    res.render('user/profile', { profileUser, noti });
}))
router.post('/profile', asyncHandler(async function(req, res) {
    const { email, password, displayName, phoneNumber } = req.body;
    const pf = await User.findByPk(req.session.userId);
    pf.displayName = displayName;
    pf.phoneNumber = phoneNumber;
    await pf.save();
    res.redirect('/profile?noti=changeSuccess');
}))

//Chức năng ND03: trang chủ
router.get('/', asyncHandler(async function(req, res) {
    const result = req.query.result;
    const listMovie = await Movie.findAll();
    const favourite = await WishList.findAll();
    res.render('homepage/homepage', { listMovie, favourite, result });
}))
router.get('/detailMovie', asyncHandler(async function(req, res) {
    const idMovie = req.query.idMovie;
    const movie = await Movie.findByPk(idMovie);
    res.render('detail/detailMovie', { movie });
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

    res.render('search/resultSearch', { listResult, action, listCinemas, listMovie });
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
                        const show = {
                            id: showtime.id,
                            begin: tempDate.getHours() + ':' + tempDate.getMinutes()
                        };
                        u.start.push(show);
                    }
                })
            } else { //Nếu không tồn tại
                const temp = { //Tạo đối tượng mới 
                    id: showtime.id,
                    idCinema: showtime.idCinema,
                    idMovie: showtime.idMovie,
                    // start: showtime.start.getHour() + ':' + showtime.start.getMinutes(),
                    start: [{
                        id: showtime.id,
                        begin: tempDate.getHours() + ':' + tempDate.getMinutes(),
                    }],
                }
                list.push(temp); //Thêm vào mảng
            }
        } else {}
    })
    res.render('showtime/showtime', { list, listMovie });
}))

router.get('/showtimeFilm', asyncHandler(async function(req, res) {
    const listCinema = await Cinema.findAll();
    const listCinemas = await Cinemas.findAll();
    const listShowtime = await Showtime.findAll();
    const list = [];
    const idMovie = req.query.idMovie;
    listShowtime.forEach(showtime => {
        const tempDate = new Date(showtime.start)
        if (showtime.idMovie == idMovie) {
            const exits = list.find(u => u.idCinema === showtime.idCinema);
            if (exits) { //Nếu có tồn tại 
                list.forEach(u => {
                    if (u.idCinema === showtime.idCinema) {
                        const show = {
                            id: showtime.id,
                            begin: tempDate.getHours() + ':' + tempDate.getMinutes()
                        };
                        u.start.push(show);
                    }
                })
            } else { //Nếu không tồn tại
                const temp = { //Tạo đối tượng mới 
                    id: showtime.id,
                    idCinema: showtime.idCinema,
                    idMovie: showtime.idMovie,
                    // start: showtime.start.getHour() + ':' + showtime.start.getMinutes(),
                    start: [{
                        id: showtime.id,
                        begin: tempDate.getHours() + ':' + tempDate.getMinutes(),
                    }],
                }
                list.push(temp); //Thêm vào mảng
            }
        } else {}
    })
    console.log(list);
    res.render('showtime/showtimeFilm', { list, listCinema, listCinemas });
}))

//Chi tiết cụm rạp
router.get('/detailCinemas', asyncHandler(async function(req, res) {
    const idCine = req.query.idCinemas;
    const cine = await Cinemas.findByPk(idCine);
    const list = await Cinema.findByIdCinema(idCine);
    res.render('detail/detailCinemas', { cine, list });
}))

//Chức năng ND05: đặt vé
//Chưa hoàn thành -- Còn đường dẫn đến views
router.get('/booking', asyncHandler(async function(req, res) {
    //Truyền vào id rạp chiếu và id phim
    //Load ngang dọc, showtime => truyền xuống view

    const idShowtime = req.query.idShowtime;
    console.log(idShowtime);
    const tempShowtime = await Showtime.findById(idShowtime);
    console.log(tempShowtime);
    const tempMovie = await Movie.findByPk(tempShowtime.idMovie);
    const idMovie = tempMovie.id;
    const tempCinema = await Cinema.findById(tempShowtime.idCinema);
    const idCinema = tempCinema.id;

    //Loại bỏ ghế trùng
    const listBo = [];
    const listTicket = await Ticket.findAll();
    const listBooking = await Booking.findAll();
    listBooking.forEach(booking => {
        if (booking.idShowTime == idShowtime) {
            listTicket.forEach(ticket => {
                if (ticket.idBooking == booking.id) {
                    listBo.push(ticket.idSeat);
                }
            })
        }
    })

    const ngang = tempCinema.horizontalSize;
    const doc = tempCinema.verticalSize;
    res.render('user/seat', { ngang, doc, idMovie, idCinema, idShowtime, listBo });
}))

//Send mail buy ticket
router.post('/sendMailBuyTicket', asyncHandler(async function(req, res) {
    const idUser = req.session.userId; //iduser trong session
    const tempUser = await User.findByPk(idUser);
    const seat = req.query.seat; //get mảng mã ghế muốn đặt
    const total = req.query.total;
    const idShowtime = req.query.idShowtime; //get
    const tempShowtime = await Showtime.findById(idShowtime);
    const idMovie = tempShowtime.idMovie;
    const idCinema = tempShowtime.idCinema;
    const checkoutMovie = await Movie.findByPk(idMovie);
    const checkoutCinema = await Cinema.findByPk(idCinema);

    const temp = await User.sendEmailBuyTicket(tempUser.email, seat, checkoutCinema.name, checkoutMovie.name, tempShowtime.start, total);

    res.redirect('/?result=' + temp);
}))

router.post('/booking', asyncHandler(async function(req, res) {

    const { seat } = req.body; //get mảng mã ghế muốn đặt
    console.log(seat);

    const idUser = req.session.userId; //iduser trong session
    const idShowtime = req.query.idShowtime; //get
    const tempShowtime = await Showtime.findById(idShowtime);
    const checkoutMovie = await Movie.findByPk(tempShowtime.idMovie);
    const checkoutCinema = await Cinema.findByPk(tempShowtime.idCinema);
    const totalMoney = tempShowtime.money * seat.length; //showtime.money*listSeat.length
    console.log(totalMoney);
    //lưu row mới vào bảng booking
    await Booking.addBooking(idUser, idShowtime, totalMoney);

    // const listBooking = await Booking.findAll();
    //chạy listSeat lưu vào bảng Ticket
    // listSeat.forEach(u => {
    //     const listBooking = await Booking.findAll();
    //     const money = 50000; //showtime.money
    //     await Ticket.addTicket(listBooking.length - 1, u, money);
    // })
    const listBooking = await Booking.findAll();
    //chạy listSeat lưu vào bảng Ticket
    // listSeat.forEach(u => {
    //     const money = 50000; //showtime.money
    //     await Ticket.addTicket(listBooking.length - 1, u, money);
    // })
    for (const u of seat) {
        const money = tempShowtime.money; //showtime.money
        const all = listBooking.length;
        console.log(listBooking.length - 1);
        console.log(u);
        console.log(money);
        await Ticket.addTicket(listBooking[all - 1].id, u, money);
    }

    res.render('user/Checkout', { totalMoney, seat, checkoutCinema, checkoutMovie, idShowtime });
    // res.redirect('/history');
    // res.redirect('/user/his?noti=bookingSuccess', { noti });
}))

//Chức năng ND06: xem lại danh sách đặt vé trong lịch sử
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

    // console.log(listHis);
    //Truyền thêm listMovie, Cinema, Cinemas để hiển thị cho idMovie và idCinema
    const listMovie = await Movie.findAll();
    const listCinema = await Cinema.findAll();
    const listCinemas = await Cinemas.findAll();

    const listHistory = [];
    for (var i = listHis.length - 1; i >= 0; i--) {
        listHistory.push(listHis[i]);
    }

    res.render('user/history', { listHistory, listMovie, listCinema, listCinemas });

}));
router.get('/Checkout', asyncHandler(async function(req, res) {
    const idMovie = req.query.idMovie;
    const movie = await Booking.findByPk();
    res.render('user/Checkout', { movie });
}))

module.exports = router