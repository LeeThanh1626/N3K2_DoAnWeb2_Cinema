//Cụm rạp chiếu phim

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng cụm rạp (Cinemas)
const Cinemas = db.define('Cinemas', {
    //tên cụm rạp
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //ngày công chiếu
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

//code function here




module.exports = Cinemas;