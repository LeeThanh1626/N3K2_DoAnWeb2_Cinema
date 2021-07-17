//Đặt chỗ

const { DataTypes, NOW, UUIDV4 } = require('sequelize');
const db = require('./db');

//Tạo bảng đặt chỗ (Booking)
//Khoan hẵn làm
const Booking = db.define('Booking', {
    // Model attributes are defined here
    //id người dùng
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
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
Booking.addBooking = async function(idUser, idShowTime, totalMoney) {
    // const time = new Date(Date.now() + (1000 * 60 * (-(new Date()).getTimezoneOffset()))).toISOString().replace('T', ' ').replace('Z', '');
    const time = new Date(Date.now());
    const all = (await Booking.findAll()).length;
    console.log(time);
    await Booking.create({
        idUser: idUser,
        idShowTime: idShowTime,
        datetime: time,
        totalMoney: totalMoney,
    });
}

module.exports = Booking;