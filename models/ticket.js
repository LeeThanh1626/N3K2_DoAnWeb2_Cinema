//Vé

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng vé (Ticket)
//Khoan hẵn làm
const Ticket = db.define('Ticket', {
    //id đặt chỗ
    idBooking: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //mã ghế
    idSeat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //giá tiền
    money: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
});

//code function here
Ticket.addTicket = async function(idBooking, idSeat, money) {
    await Ticket.create({
        idBooking: idBooking,
        idSeat: idSeat,
        money: money,
    });
};

module.exports = Ticket;