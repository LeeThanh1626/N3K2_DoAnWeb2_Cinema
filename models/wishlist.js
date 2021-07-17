//Danh sách phim yêu thích

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng WishList
const WishList = db.define('WishList', {
    //Movie
    idMovie: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

module.exports = WishList;