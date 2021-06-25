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
        type: DataTypes.DATEONLY,
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
//thêm phim
Movie.addMovie = async function(name, openingDay, poster, time) {
    await Cinema.create({
        name: name,
        openingDay: openingDay,
        poster: poster,
        time: time,
    })
}

//xóa phim
Movie.deleteMovie = async function(id) {
    const temp = await Movie.findByPk(id);
    await temp.destroy();
}

//cập nhật phim
//không yêu cầu
// Movie.updateMovie = async function(id, name, openingDay, poster, time) {

// }



module.exports = Movie;