//Danh sách phim yêu thích

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng user
const WishList = db.define('WishList', {
    //email
    idMovie: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

module.exports = WishList;