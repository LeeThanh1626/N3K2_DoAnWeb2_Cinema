const {  DataTypes } = require('sequelize');

const db = require('./db');



const User = db.define('User', {
   
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false

       
    },
    

    code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,

       
    }
    ,
}
   
);
// const users = [{
//     id: 1,
//     displayName:'Như trần',
//     email: 'ngocnhu21042000@gmail.com',
//     password: '$2b$10$tkOv8mOjQgQly62Y9DBy6u1eyWH6r6TNz69C0ayXm61ggrIz8oF4m',
// },
// {
//     id: 2,
//     displayName:'Như trần 123',
//     email: 'ngocnhu2104@gmail.com',
//     password: '$2b$10$tkOv8mOjQgQly62Y9DBy6u1eyWH6r6TNz69C0ayXm61ggrIz8oF4m',
// }];
User.findbyEmail = function (email) {
    return User.findOne({
        where:
        {
            email,
        },
    });
}
User.findbyId = function (id) {
    // return users.find(u => u.id === id);
    return User.findByPk(id);
}
User.findbydeplay = function (displayName) {
    return users.find(u => u.displayName === displayName);
}
// exports.validatePass = function(hash,password)

User.Register = async function(displayName, email, password) {
    const bcrypt = require('bcrypt');
    const hash = bcrypt.hashSync(password, 10);
    const code = "123";
    await User.create({
        displayName: displayName,
        email: email,
        password: hash,
        code: code,
    });
    User.sendEmail(email, code);
}

User.sendEmail = async function(Email, Code) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'tranngocnhuit@gmail.com',
            pass: 'ngocnhu2104'
        }
    });
    
    const id = await User.findbyEmail(Email);
    const info = await transporter.sendMail({
        from: "tranngocnhuit@gmail.com",
        to: Email,
        subject: "XÁC NHẬN TÀI KHOẢN ĐĂNG KÝ",
        text: "Nhấp vào đường link để kích hoạt", 
       
        html: "<b>localhost:3006/auth/register/confirm?code=" + Code + "&id=" + id.id + "</b>",
       
    });
}
User.confirm = async function(code, id) {
    const user = await User.findByPk(id);
    if (code === user.code)
        user.code = null;
    await user.save();
}


module.exports =User;