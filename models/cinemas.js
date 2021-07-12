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
    const all = (await Cinemas.findAll()).length;
    await Cinemas.create({
        id: all + 1,
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
    await temp.destroy();
}

//cập nhật cụm rạp
//không yêu cầu
// Cinemas.updateCinemas = async function(id, name, address) {

// }



module.exports = Cinemas;