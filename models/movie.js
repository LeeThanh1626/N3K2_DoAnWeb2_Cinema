//Phim

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng phim (Movie)
const Movie = db.define('Movie', {
    //tên phim
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
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
    //thể loại
    theloai: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //đạo diễn
    directed: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //diễn viên
    starring: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //quốc gia
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //tóm tắt
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    //Trailer
    trailer: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

//code function here
//thêm phim
Movie.addMovie = async function(name, openingDay, poster, time, theloai, directed, starring, country, content, trailer) {
    const listMovie = await Movie.findAll();
    const all = listMovie.length;
    await Movie.create({
        id: listMovie[all - 1].id + 1,
        name: name,
        openingDay: openingDay,
        poster: poster,
        time: time,
        theloai: theloai,
        directed: directed,
        starring: starring,
        country: country,
        content: content,
        trailer: trailer,
    })
    if (all < (await Movie.findAll()).length) {
        return 1;
    } else {
        return -1;
    }
}

//xóa phim
Movie.deleteMovie = async function(id) {
    const temp = await Movie.findByPk(id);
    const all = (await Movie.findAll()).length;
    await temp.destroy();
    if (all > (await Movie.findAll()).length) {
        return 2;
    } else {
        return -2;
    }
}

//cập nhật phim
//không yêu cầu
// Movie.updateMovie = async function(id, name, openingDay, poster, time) {

// }



module.exports = Movie;