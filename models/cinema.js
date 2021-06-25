//Rạp chiếu phim

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng rạp phim (Cinema)
const Cinema = db.define('Theater', {
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
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //kích thước chiều dọc
    verticalSize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

//code function here

//thêm rạp
Cinema.addCinema = async function(name, idCinemas, horizontalSize, verticalSize) {
    await Cinema.create({
        name: name,
        idCinemas: idCinemas,
        horizontalSize: horizontalSize,
        verticalSize: verticalSize,
    })
}

//xóa rạp
Cinema.deleteCinema = async function(id) {
    const temp = await Cinema.findByPk(id);
    await temp.destroy();
}

//cập nhật thông tin rạp
//không yêu cầu
// Cinema.updateCinema = async function(id, name, idCinemas, horizontalSize, verticalSize) {

// }



module.exports = Cinema;