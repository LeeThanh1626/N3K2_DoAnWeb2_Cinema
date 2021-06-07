//Người dùng

const { DataTypes } = require('sequelize');
const db = require('./db');

//Tạo bảng user
const User = db.define('User', {
    //email
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

// User.Register = async function(displayName, email, password) {
//     const bcrypt = require('bcrypt');
//     const hash = bcrypt.hashSync(password, 10);
//     const code = "123";
//     await User.create({
//         displayName: displayName,
//         email: email,
//         password: hash,
//         code: code,
//     });
//     User.sendEmail(email, code);
// }

// User.sendEmail = async function(Email, Code) {
//     const nodemailer = require('nodemailer');
//     const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//             user: 'ltw1.18600232@gmail.com',
//             pass: 'abcxyz123~'
//         }
//     });
//     const id = await User.findByEmail(Email);
//     const info = await transporter.sendMail({
//         from: "ltw1.18600232@gmail.com",
//         to: Email,
//         subject: "Xac nhan tai khoan",
//         text: "Nhan vao lien ket de kich hoat tai khoan",
//         // html: "<b>https://ltw2-18600232-w3.herokuapp.com/auth/register/confirm?code=" +  Code  + "&id=" + id.id + "</b>"
//         // html: "<b>localhost:3000/auth/register/confirm?code=" + Code + "&id=" + id.id + "</b>"
//         html: "<b>https://ltw2-18600232-w3.herokuapp.com/auth/register/confirm?code=" + Code + "&id=" + id.id + "</b>"
//     });
// }

// User.confirm = async function(code, id) {
//     const user = await User.findByPk(id);
//     if (code === user.code)
//         user.code = null;
//     await user.save();
// }

User.updateUser = async function(email, displayName, phoneNumber) {

}


module.exports = User;