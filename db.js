const {Sequelize, DataTypes} = require('sequelize');
const db = {};
const path = require('path')

///// --------> CONFIG JSON APP <-------/////////
const fs = require('fs')
const filePathConfig = path.join(__dirname, './config.json')
const rawDataConfig = fs.readFileSync(filePathConfig)
const config = JSON.parse(rawDataConfig)



// db.connection = new Sequelize(process.env.JOVEN_DB,process.env.JOVEN_DB_USER,process.env.JOVEN_DB_PASS, {host: 'localhost', dialect: "mysql"})

db.connection = new Sequelize(config.db_name,config.db_user,config.db_password, {host: config.db_host, dialect: "mysql"})

db.Producers = require('./models/producers')(db.connection, DataTypes)
db.Varieties = require('./models/varieties')(db.connection, DataTypes)
db.Trays = require('./models/trays')(db.connection, DataTypes)
db.Receptions = require('./models/receptions')(db.connection, DataTypes)
db.Pays = require('./models/pays')(db.connection, DataTypes)


db.Receptions.belongsTo(db.Varieties)
db.Receptions.belongsTo(db.Producers)
db.Pays.belongsTo(db.Producers)
db.Pays.belongsTo(db.Receptions)
// db.Pallets.belongsTo(db.Varieties)


module.exports = db
