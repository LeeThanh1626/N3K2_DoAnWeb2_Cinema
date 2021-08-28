//Cụm rạp chiếu phim

const { DataTypes } = require('sequelize');
const db = require('./db');
const Movie = require('./movie');

//Tạo bảng cụm rạp (Cinemas)
const Cinemas = db.define('Cinemas', {
    //tên cụm rạp
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //ngày công chiếu
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: false
    }
});

//code function here

//thêm cụm rạp
Cinemas.addCinemas = async function(name, address) {
    const listCinemas = await Cinemas.findAll()
    const all = listCinemas.length;
    await Cinemas.create({
        id: listCinemas[all - 1].id + 1,
        name: name,
        address: address,
    })
    if (all < (await Cinemas.findAll()).length) {
        return 1;
    } else {
        return -1;
    }
}

// Cinemas.addCinemas = async function(name, address) {
//     try {
//         const user = await Cinemas.create({
//                 id: ,
//                 name: name,
//                 address: address,
//             })
//             // you can now access the newly created user
//         console.log('success');
//     } catch (err) {
//         // print the error details
//         console.log(err);
//     }
// }

//xóa cụm rạp
Cinemas.deleteCinemas = async function(id) {
    const temp = await Cinemas.findByPk(id);
    const all = (await Cinemas.findAll()).length;
    await temp.destroy();
    if (all > (await Cinemas.findAll()).length) {
        return 2;
    }
    return -2;
}

//cập nhật cụm rạp
//không yêu cầu
// Cinemas.updateCinemas = async function(id, name, address) {

// }



module.exports = Cinemas;