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
Cinema.findById = async function(id) {
    return Cinema.findByPk(id);
}

//thêm rạp
Cinema.addCinema = async function(name, idCinemas, horizontalSize, verticalSize) {
    const all = (await Cinema.findAll()).length;
    await Cinema.create({
        id: all + 1,
        name: name,
        idCinemas: idCinemas,
        horizontalSize: horizontalSize,
        verticalSize: verticalSize,
    })
    if (all < (await Cinema.findAll()).length) {
        return 1;
    } else {
        return -1;
    }
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