
//kiểm tra xem có connect vào database dc k
const { Sequelize } = require('sequelize');
module.exports  = new Sequelize(process.env.DATABASE_URL ||'postgres://postgres:postgres@localhost:5432/todo');
