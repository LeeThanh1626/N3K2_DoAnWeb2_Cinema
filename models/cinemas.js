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

//thêm cụm rạp
Cinemas.addCinemas = async function(name, address) {
    await Cinemas.create({
        name: name,
        address: address,
    })
}

//xóa cụm rạp
Cinemas.deleteCinemas = async function(id) {
    const temp = await Cinemas.findByPk(id);
    await temp.destroy();
}

//cập nhật cụm rạp
//không yêu cầu
// Cinemas.updateCinemas = async function(id, name, address) {

// }



module.exports = Cinemas;