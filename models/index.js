var fs        = require("fs");
var path      = require("path");

const Sequelize = require("sequelize");
const sequelize = new Sequelize('intern', 'root', '123456As', {
  host: 'localhost',
  dialect: "mysql",
  operatorsAliases: false,
  logging:false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
   
    var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes) //sequelize.import(path.join(__dirname, file));
    db[model.name] = model;

  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;