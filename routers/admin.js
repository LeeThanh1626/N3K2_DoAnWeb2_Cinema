const { promisify } = require('util');
const asyncHandler = require('express-async-handler');
const express = require('express');
const multer = require('multer');
const rename = promisify(require('fs').rename);
const upload = multer({ storage: new multer.memoryStorage() });
// const upload = multer({ dest: './public/images' })

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
//Trang hiển thị danh sách cụm rạp
router.get('/manageCinemas', asyncHandler(async function(req, res) {
    const listCinemas = await Cinemas.findAll();
    const result = req.query.result;
    res.render('admin/manageCinemas/manageCinemas', { listCinemas, result });
}))

//Trang hiển thị danh sách rạp thuộc cụm rạp
router.get('/manageCinema', asyncHandler(async function(req, res) {
    const idCinemas = req.query.idCinemas;
    const result = req.query.result;
    const tempCinemas = await Cinemas.findByPk(idCinemas);
    const nameCinemas = tempCinemas.name;
    const listTemp = await Cinema.findAll();
    const listCinema = [];
    listTemp.forEach(temp => {
        if (temp.idCinemas == idCinemas) {
            listCinema.push(temp);
        }
    })
    res.render('admin/manageCinema/manageCinema', { listCinema, nameCinemas, idCinemas, result });
}))

//Trang hiển thị danh sách phim
router.get('/manageMovie', asyncHandler(async function(req, res) {
    const result = req.query.result;
    const listMovie = await Movie.findAll();
    res.render('admin/manageMovie/manageMovie', { listMovie, result });
}))

//Trang hiển thị danh sách suất chiếu
router.get('/manageShowtime', asyncHandler(async function(req, res) {
    const listTempShowtime = await Showtime.findAll();
    const result = req.query.result;
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
    res.render('admin/manageShowtime/manageShowtime', { listShowtime, result });
}))

//Trang thêm cụm rạp
router.get('/addCinemas', asyncHandler(async function(req, res) {
    res.render('admin/manageCinemas/addCinemas');
}))
router.post('/addCinemas', asyncHandler(async function(req, res) {
    const result = -1;
    const { name, address } = req.body;
    if (name && address) {
        const result = await Cinemas.addCinemas(name, address);
    }
    res.redirect('/admin/manageCinemas?result=' + result);
}))

//Trang thêm rạp thuộc cụm rạp
router.get('/addCinema', asyncHandler(async function(req, res) {
    const idCinemas = req.query.idCinemas;
    const nameCinemas = await Cinemas.findByPk(idCinemas);
    res.render('admin/manageCinema/addCinema', { nameCinemas, idCinemas });
}))
router.post('/addCinema', asyncHandler(async function(req, res) {
    const result = -1;
    const { name, horizontalSize, verticalSize } = req.body;
    const idCinemas = req.query.idCinemas;
    if (name && horizontalSize && verticalSize) {
        const result = await Cinema.addCinema(name, idCinemas, horizontalSize, verticalSize);
    }
    res.redirect('/admin/manageCinema?result=' + result + '&idCinemas=' + idCinemas);
}))

//Trang thêm phim
router.get('/addMovie', asyncHandler(async function(req, res) {
    res.render('admin/manageMovie/addMovie');
}))
router.post('/addMovie', upload.single('pic'), asyncHandler(async function(req, res) {
    const pic = req.file.buffer;
    // await rename(req.file.path, `./public/images/${(await Movie.findAll()).length + 1}.jpg`)
    const { name, time, date } = req.body;
    const day = new Date(date);
    const result = await Movie.addMovie(name, day, pic, time);
    res.redirect('/admin/manageMovie?result=' + result);
}))

//Hiển thị hình ảnh
router.get('/image/:id', asyncHandler(async function(req, res) {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie || !movie.poster) {
        res.status(404).send('File not found');
    } else {
        res.header('Content-Type', 'image/jpeg').send(movie.poster);
    }
}))

//Trang thêm xuất chiếu
router.get('/addShowtime', asyncHandler(async function(req, res) {
    const listMovie = await Movie.findAll();
    const listCinema = await Cinema.findAll();

    res.render('admin/manageShowtime/addShowtime', { listMovie, listCinema });
}))
router.post('/addShowtime', asyncHandler(async function(req, res) {
    const result = -1;
    const { idCinema, idMovie, date, start, finish, money } = req.body;
    if (idCinema && idMovie && date && start && finish && money) {
        const ts = date + ' ' + start + ':00:00+07';
        const fs = date + ' ' + finish + ':00:00+07';
        const result = await Showtime.addShowtime(idCinema, idMovie, ts, fs, money);
    }
    res.redirect('/admin/manageShowtime?result=' + result);
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