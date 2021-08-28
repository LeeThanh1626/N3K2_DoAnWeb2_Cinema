//Người dùng

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng user
const User = db.define('User', {
    //email
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //password
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //họ tên
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //số điện thoại
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //mà kích hoạt tài khoản
    code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    //vai trò (người dùng/quản lý)
    permission: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// code function here
User.findByEmail = async function(email) {
    return User.findOne({
        where: {
            email,
        }
    });
}

User.findById = async function(id) {
    return User.findByPk(id);
}

User.Register = async function(email, password, displayName, phoneNumber) {
    const bcrypt = require('bcrypt');
    const random = require('random');
    const hash = bcrypt.hashSync(password, 10);
    const code = random.int((min = 1000), (max = 9999));
    console.log(code);

    const listUser = await User.findAll();
    const all = listUser.length;
    await User.create({
        id: listUser[all - 1].id + 1,
        email: email,
        password: hash,
        displayName: displayName,
        phoneNumber: phoneNumber,
        code: code,
        permission: 0,
    });
    User.sendEmail(email, code);
    if (all < (await User.findAll()).length) {
        return 1;
    } else {
        return -1;
    }
}

User.sendEmail = async function(Email, Code) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'ltw1.18600232@gmail.com',
            pass: 'Th@nhson2209'
        }
    });
    const id = await User.findByEmail(Email);
    const info = await transporter.sendMail({
        from: "ltw1.18600232@gmail.com",
        to: Email,
        subject: "Xac nhan tai khoan",
        text: "Nhan vao lien ket de kich hoat tai khoan",
        // html: "<b>https://ltw2-18600232-w3.herokuapp.com/auth/register/confirm?code=" +  Code  + "&id=" + id.id + "</b>"
        html: "<b>localhost:3000/auth/signup/confirm?code=" + Code + "&id=" + id.id + "</b>",
        // html: '<a href="localhost:3000/auth/signup/confirm?code=' + Code + '&id=' + id.id + '">Nhấp vào đây để login</a>',
        // html: "<b>https://ltw2-18600232-w3.herokuapp.com/auth/register/confirm?code=" + Code + "&id=" + id.id + "</b>"
    });
}

User.sendEmailBuyTicket = async function(Email, seat, nameCinema, nameMovie, start, total) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'ltw1.18600232@gmail.com',
            pass: 'Th@nhson2209'
        }
    });
    const id = await User.findByEmail(Email);
    const info = await transporter.sendMail({
        from: "ltw1.18600232@gmail.com",
        to: Email,
        subject: "Mua vé thành công.",
        text: "Tên phim: " + nameMovie + ".\
        Tên rạp: " + nameCinema + ".\
        Suất chiếu bắt đầu lúc: " + start.getHours() + ":" + start.getMinutes() + ".\
        Ghế khách hàng đã đặt: " + seat + ".\
        Tổng tiền:" + total,
        // html: "<b>https://ltw2-18600232-w3.herokuapp.com/auth/register/confirm?code=" +  Code  + "&id=" + id.id + "</b>"
        // html: "<b>localhost:3000/auth/signup/confirm?code=" + Code + "&id=" + id.id + "</b>",
        // html: '<a href="localhost:3000/auth/signup/confirm?code=' + Code + '&id=' + id.id + '">Nhấp vào đây để login</a>',
        // html: "<b>https://ltw2-18600232-w3.herokuapp.com/auth/register/confirm?code=" + Code + "&id=" + id.id + "</b>"
    });
    return 3;
}

User.confirm = async function(code, id) {
    const user = await User.findByPk(id);
    if (code === user.code)
        user.code = null;
    await user.save();
}

User.forgotPass = async function(email) {
    const random = require('random');
    const code = random.int((min = 1000), (max = 9999));
    console.log(code);

    const user = await User.findByEmail(email);
    user.code = code;
    await user.save();
    User.sendEmailResetPass(email, code);
}

User.sendEmailResetPass = async function(Email, Code) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'ltw1.18600232@gmail.com',
            pass: 'Th@nhson2209'
        }
    });
    const id = await User.findByEmail(Email);
    const info = await transporter.sendMail({
        from: "ltw1.18600232@gmail.com",
        to: Email,
        subject: "Reset Password",
        text: "Nhan vao lien ket de dat lai mat khau",
        // html: "<b>https://ltw2-18600232-w3.herokuapp.com/auth/register/confirm?code=" +  Code  + "&id=" + id.id + "</b>"
        html: "<b>localhost:3000/auth/resetPass/confirmPass?code=" + Code + "&id=" + id.id + "</b>",
        // html: '<a href="localhost:3000/auth/signup/confirm?code=' + Code + '&id=' + id.id + '">Nhấp vào đây để login</a>',
        // html: "<b>https://ltw2-18600232-w3.herokuapp.com/auth/register/confirm?code=" + Code + "&id=" + id.id + "</b>"
    });
}

User.confirmPass = async function(code, id) {
    const user = await User.findByPk(id);
    if (code === user.code)
        user.code = null;
    await user.save();
}


module.exports = User;