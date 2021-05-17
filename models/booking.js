//Đặt chỗ

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng đặt chỗ (Booking)
//Khoan hẵn làm
const Booking = db.define('Booking', {
    // Model attributes are defined here
    //id người dùng
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //id suất chiếu
    idShowTime: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //thời điểm đặt vé
    datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    //tổng tiền
    totalMoney: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
});

//code function here




module.exports = Booking;