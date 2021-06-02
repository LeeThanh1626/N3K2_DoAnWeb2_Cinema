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
        const { name, idCinemas, horizontalSize, verticalSize } = req.body;
        await Cinema.addCinema(name, idCinemas, horizontalSize, verticalSize);
    } else if (action === "deleteCinema") { //Xóa rạp chiếu
        await Cinema.deleteCinema(id);
    } else if (action === "updateCinema") { //Cập nhật rạp chiếu
        const { name, idCinemas, horizontalSize, verticalSize } = req.body;
        await Cinema.updateCinema(id, name, idCinemas, horizontalSize, verticalSize);
    } else if (action === "addCinemas") { //Thêm cụm rạp
        const { name, address } = req.body;
        await Cinemas.addCinemas(name, address);
    } else if (action === "deleteCinemas") { //Xóa cụm rạp
        await Cinemas.deleteCinemas(id);
    } else if (action === "updateCinemas") { //Cập nhật cụm rạp
        const { name, address } = req.body;
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
    const title = "Quản lý phim"

    res.render('auth/manageMovie', { title, listMovie, listShowtime });
}))

router.post('/mangageMovie', asyncHandler(async function(req, res) {
    const action = req.query.action;
    const id = req.query.id;

    if (action === "addCinema") { //Thêm phim
        //name, openingDay, poster, time
        const { name, openingDay, poster, time } = req.body;
        await Cinema.addCinema(name, openingDay, poster, time);
    } else if (action === "deleteCinema") { //Xóa phim
        await Cinema.deleteCinema(id);
    } else if (action === "updateCinema") { //Cập nhật phim
        const { name, openingDay, poster, time } = req.body;
        await Cinema.updateCinema(id, name, openingDay, poster, time);
    } else if (action === "addCinemas") { //Thêm xuất chiếu
        const { idCinema, idMovie, start, finish, money } = req.body;
        await Cinemas.addCinemas(idCinema, idMovie, start, finish, money);
    } else if (action === "deleteCinemas") { //Xóa xuất chiếu
        await Cinemas.deleteCinemas(id);
    } else if (action === "updateCinemas") { //Cập nhật xuất chiếu
        const { idCinema, idMovie, start, finish, money } = req.body;
        await Cinemas.updateCinemas(id, idCinema, idMovie, start, finish, money);
    }

    //render lại trang quản lý phim và xuất chiếu
    res.require('/admin/manageMovie');
}))

//Màn hình chủ chức năng QL03 và QL04
//Chưa hoàn thành -- Còn đường dẫn đến views
router.get('/statistics', asyncHandler(async function(req, res) {
    res.render('');
}))

//Chức năng QL03 và QL04: thống kê doanh thu theo cụm rạp và theo phim
router.post('/statistics', asyncHandler(async function(req, res) {
    const action = req.query.action;
    //from ... to ... : bắt đầu từ .... đến ...
    const { from, to } = req.body;

    //Tạo list đối tượng { name:..., ticket:..., money:... } truyền vào form doanh thu
    const listStatistic = [];

    const listBooking = await Booking.findAll();
    const listShowtime = await Showtime.findAll();
    const listMovie = await Movie.findAll();

    //Xử lý doanh thu phim
    listBooking.forEach(tempBooking => {
        //Kiểm tra ngày đặt chỗ có trong khoảng thời gian from ... to không
        if (tempBooking.createdAt >= from && tempBooking.createdAt <= to) {
            listShowtime.forEach(tempShowtime => {
                //Kiểm tra đặt chỗ của xuất chiếu nào
                if (tempBooking.idShowTime === tempShowtime.id) {
                    //Phim
                    listMovie.forEach(tempMovie => {
                        //Kiểm tra xuất chiếu của phim nào
                        if (tempShowtime.idMovie === tempMovie.id) {
                            //Kiểm tra phim đã có trong mảng chưa
                            const exits = listStatistic.find(u => u.name === tempMovie.name);
                            if (exits) { //Nếu có tồn tại 
                                listStatistic.forEach(u => {
                                    if (u.name === tempMovie.name) { //Cập nhật lại số vé và doanh thu
                                        u.ticket = u.ticket + 1;
                                        u.money = u.money + tempBooking.totalMoney;
                                    }
                                })
                            } else { //Nếu không tồn tại
                                const temp = { //Tạo đối tượng mới 
                                    name: tempMovie.name, //Lưu tên phim
                                    ticket: 1, //Lưu số vé
                                    money: tempBooking.totalMoney, //Lưu tổng doanh thu
                                }
                                listStatistic.push(temp); //Thêm vào mảng
                            }
                        }
                    });
                    //Cụm rạp
                    listCinemas.forEach(tempCinema => {
                        //Kiểm tra xuất chiếu của rạp nào
                        if (tempShowtime.idCinema === tempCinema.id) {
                            listCinemas.forEach(tempCinemas => {
                                //Kiểm tra rạp của cụm rạp nào
                                if (tempCinema.idCinemas === tempCinemas.id) {
                                    //Kiểm tra cum rạp đã có trong mảng chưa
                                    const exits = listStatistic.find(u => u.name === tempCinemas.name);
                                    if (exits) { //Nếu có tồn tại 
                                        listStatistic.forEach(u => {
                                            if (u.name === tempCinemas.name) { //Cập nhật lại số vé và doanh thu
                                                u.ticket = u.ticket + 1;
                                                u.money = u.money + tempBooking.totalMoney;
                                            }
                                        })
                                    } else { //Nếu không tồn tại
                                        const temp = { //Tạo đối tượng mới 
                                            name: tempCinemas.name, //Lưu tên cụm rạp
                                            ticket: 1, //Lưu số vé
                                            money: tempBooking.totalMoney, //Lưu tổng doanh thu
                                        }
                                        listStatistic.push(temp); //Thêm vào mảng
                                    }
                                }
                            })
                        }
                    });
                }
            })
        }
    })

    if (action === "Cinemas") { //Doanh thu của cụm rạp
        res.render('', { listStatistic })
    } else { //Doanh thu theo phim
        res.render('', { listStatistic });
    }
}))

module.exports = router