//Xuất chiếu

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng suất chiếu (Showtime)
const Showtime = db.define('Showtime', {
    //id rạp
    idCinema: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //id phim
    idMovie: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //thời điểm bắt đầu
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    //thời điểm kết thúc
    finish: {
        type: DataTypes.DATE,
        allowNull: false
    },
    //giá vé
    money: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
});

//code function here
Showtime.addShowtime = async function(idCinema, idMovie, start, finish, money) {

}

Showtime.deleteShowtime = async function(id) {

}

Showtime.updateShowtime = async function(id, idCinema, idMovie, start, finish, money) {

}



module.exports = Showtime;