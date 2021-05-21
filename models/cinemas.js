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

//thêm rạp
Cinemas.addCinemas = async function(name, address) {

}

//xóa rạp
Cinemas.deleteCinemas = async function(id) {

}

Cinemas.updateCinemas = async function(id, name, address) {

}



module.exports = Cinemas;