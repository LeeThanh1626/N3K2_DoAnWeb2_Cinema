//Phim

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng phim (Movie)
const Movie = db.define('Movie', {
    //tên phim
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //ngày công chiếu
    openingDay: {
        type: DataTypes.DATE,
        allowNull: false
    },
    //poster phim
    poster: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    //thời lượng
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

//code function here




module.exports = Movie;