// const { Sequelize } = require('sequelize');
// module.exports = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:310899@localhost:5432/postgres')

const { Sequelize } = require('sequelize');
module.exports = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:310899@localhost:5432/postgres', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        }
    }
})