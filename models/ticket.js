//Vé

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng vé (Ticket)
//Khoan hẵn làm
const Ticket = db.define('Ticket', {
    //id đặt chỗ
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    idBooking: {
        type: DataTypes.UUID,
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
    const all = (await Ticket.findAll()).length;
    await Ticket.create({
        idBooking: idBooking,
        idSeat: idSeat,
        money: money,
    });
};

module.exports = Ticket;