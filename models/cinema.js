//Rạp chiếu phim

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng rạp phim (Cinema)
const Cinema = db.define('Cinema', {
    //tên cụm rạp
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //id cụm rạp
    idCinemas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //kích thước chiều ngang
    horizontalSize: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    //kích thước chiều dọc
    verticalSize: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
});

//code function here

//thêm rạp
Cinema.addCinema = async function(name, idCinemas, horizontalSize, verticalSize) {

}

//xóa rạp
Cinema.deleteCinema = async function(id) {

}

//cập nhật thông tin rạp
Cinema.updateCinema = async function(id, name, idCinemas, horizontalSize, verticalSize) {

}



module.exports = Cinema;