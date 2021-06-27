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

const router = express.Router();

//Code get, post here
router.get('/', function(req, res) {

});


//Chức năng QL02
//Hiển thị trang quản lý rạp và cụm rạp
//Chưa hoàn thành -- Còn đường dẫn đến views
router.get('/manageCinemas', asyncHandler(async function(req, res) {
    const listCinemas = await Cinemas.findAll();
    res.render('admin/manageCinemas/manageCinemas', { listCinemas });
}))
router.get('/manageCinema', asyncHandler(async function(req, res) {
    const idCinemas = req.query.idCinemas;
    const tempCinemas = await Cinemas.findByPk(idCinemas);
    const nameCinemas = tempCinemas.name;
    const listTemp = await Cinema.findAll();
    const listCinema = [];
    listTemp.forEach(temp => {
        if (temp.idCinemas == idCinemas) {
            listCinema.push(temp);
        }
    })
    res.render('admin/manageCinema/manageCinema', { listCinema, nameCinemas });
}))
router.get('/manageMovie', asyncHandler(async function(req, res) {
    const listMovie = await Movie.findAll();
    res.render('admin/manageMovie/manageMovie', { listMovie });
}))
router.get('/manageShowtime', asyncHandler(async function(req, res) {
    const listTempShowtime = await Showtime.findAll();
    const listShowtime = [];
    for (const showtime of listTempShowtime) {
        const tempCinema = await Cinema.findByPk(showtime.idCinema);
        const tempMovie = await Movie.findByPk(showtime.idMovie);
        const tempstart = new Date(showtime.start)
        const tempfinish = new Date(showtime.finish)
        const start = tempstart.getDay() + '/' + (tempstart.getMonth() + 1) + '/' + tempstart.getFullYear() + ' ' + tempstart.getHours() + ':' + tempstart.getMinutes();
        const finish = tempfinish.getDay() + '/' + (tempfinish.getMonth() + 1) + '/' + tempfinish.getFullYear() + ' ' + tempfinish.getHours() + ':' + tempfinish.getMinutes();
        const temp = {
            id: showtime.id,
            nameCinema: tempCinema.name,
            nameMovie: tempMovie.name,
            start: start,
            finish: finish,
            money: showtime.money,
        }
        listShowtime.push(temp);
    }
    res.render('admin/manageShowtime/manageShowtime', { listShowtime });
}))

router.get('/addCinemas', asyncHandler(async function(req, res) {}))
router.get('/addCinema', asyncHandler(async function(req, res) {}))
router.get('/addMovie', asyncHandler(async function(req, res) {}))
router.get('/addShowtime', asyncHandler(async function(req, res) {}))

router.post('/addCinemas', asyncHandler(async function(req, res) {}))
router.post('/addCinema', asyncHandler(async function(req, res) {}))
router.post('/addMovie', asyncHandler(async function(req, res) {}))
router.post('/addShowtime', asyncHandler(async function(req, res) {}))

//Thêm, xóa, sửa Cinemas, Cinema, Movie, Showtime
// router.post('/manageCinema', asyncHandler(async function(req, res) {
//     const action = req.query.action;
//     const id = req.query.id;

//     if (action === "addCinema") { //Thêm rạp chiếu
//         const { name, idCinemas, horizontalSize, verticalSize } = req.body;
//         await Cinema.addCinema(name, idCinemas, horizontalSize, verticalSize);
//     } else if (action === "deleteCinema") { //Xóa rạp chiếu
//         await Cinema.deleteCinema(id);
//     } else if (action === "updateCinema") { //Cập nhật rạp chiếu
//         const { name, idCinemas, horizontalSize, verticalSize } = req.body;
//         await Cinema.updateCinema(id, name, idCinemas, horizontalSize, verticalSize);
//     } else if (action === "addCinemas") { //Thêm cụm rạp
//         const { name, address } = req.body;
//         await Cinemas.addCinemas(name, address);
//     } else if (action === "deleteCinemas") { //Xóa cụm rạp
//         await Cinemas.deleteCinemas(id);
//     } else if (action === "updateCinemas") { //Cập nhật cụm rạp
//         const { name, address } = req.body;
//         await Cinemas.updateCinemas(id, name, address);
//     }

//     //render lại danh sách cụm rạp và rạp
//     res.redirect('/admin/manageCinema');
// }))

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
router.get('/statistic', asyncHandler(async function(req, res) {
    res.render('admin/statistic/statistic');
}))

//Chức năng QL03 và QL04: thống kê doanh thu theo cụm rạp và theo phim
router.post('/statistic', asyncHandler(async function(req, res) {
    // const action = req.query.action;
    //from ... to ... : bắt đầu từ .... đến ...
    const { action, from, to } = req.body;

    const a = new Date(from);
    const b = new Date(to);
    // console.log(a.getDate());
    // console.log(a.getMonth());
    // console.log(a.getFullYear());
    // console.log(b.getDate());
    // console.log(b.getMonth());
    // console.log(b.getFullYear());

    //Tạo list đối tượng { name:..., ticket:..., money:... } truyền vào form doanh thu
    const listStatistic = [];

    const listBooking = await Booking.findAll();
    const listShowtime = await Showtime.findAll();
    const listMovie = await Movie.findAll();
    const listCinema = await Cinema.findAll();
    const listCinemas = await Cinemas.findAll();

    //Xử lý doanh thu phim
    listBooking.forEach(tempBooking => {
        const dataDate = tempBooking.createdAt;
        const date = new Date(dataDate);
        // console.log(dataDate.getDate());
        // console.log(dataDate.getMonth());
        // console.log(dataDate.getFullYear());
        //Kiểm tra ngày đặt chỗ có trong khoảng thời gian from ... to không
        // if (dataDate.getDate() === a.getDate() && dataDate.getMonth() === a.getMonth() && dataDate.getFullYear() === a.getFullYear() && dataDate.getDate() === b.getDate() && dataDate.getMonth() === b.getMonth() && dataDate.getFullYear() === b.getFullYear()) {
        if (((date.getTime() - a.getTime()) / 1000 >= 0) && ((b.getTime() - date.getTime()) / 1000 >= 0)) {
            listShowtime.forEach(tempShowtime => {
                //Kiểm tra đặt chỗ của xuất chiếu nào
                if (tempBooking.idShowTime === tempShowtime.id) {
                    //Phim
                    if (action === "Movie") { //Doanh thu theo phim
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
                        // console.log(listStatistic);
                        // res.render('admin/resultStatistic', { listStatistic });
                    } else { //Doanh thu của cụm rạp
                        //Cụm rạp
                        console.log("1");
                        listCinema.forEach(tempCinema => {
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
                }
            })
        }
    })
    const tu = a.getDate() + '-' + (a.getMonth() + 1) + '-' + a.getFullYear();
    const den = b.getDate() + '-' + (b.getMonth() + 1) + '-' + b.getFullYear();
    res.render('admin/statistic/resultStatistic', { listStatistic, tu, den, action });
}))

module.exports = router