//Rạp chiếu phim

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng rạp phim (Cinema)
const Cinema = db.define('Theater', {
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

//Find Cinema By Id Cinemas
Cinema.findByIdCinema = async function(id) {
    const listCinema = await Cinema.findAll();
    const list = [];
    listCinema.forEach(Cinema => {
        if (Cinema.idCinemas == id) {
            list.push(Cinema);
        }
    });
    return list;
}

//thêm rạp
Cinema.addCinema = async function(name, idCinemas, horizontalSize, verticalSize) {
    const listCinema = await Cinema.findAll();
    const all = listCinema.length;
    await Cinema.create({
        id: listCinema[all - 1].id + 1,
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
    const all = (await Cinema.findAll()).length;
    await temp.destroy();
    if (all > (await Cinema.findAll()).length) {
        return 2;
    } else {
        return -2;
    }
}

//cập nhật thông tin rạp
//không yêu cầu
// Cinema.updateCinema = async function(id, name, idCinemas, horizontalSize, verticalSize) {

// }



module.exports = Cinema;