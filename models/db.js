const { Sequelize } = require('sequelize');
module.exports = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:beson0302@localhost:5432/Doan'
    // , {
    //     dialect: 'postgres',
    //     dialectOptions: {
    //         ssl: {
    //             rejectUnauthorized: false,
    //         }
    //     }
    // }
)