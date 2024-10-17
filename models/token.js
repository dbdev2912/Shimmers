const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../config/db')

const Auth = require('./auth')

const Token = sequelize.define('jwt_storage', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        
    },
    created: {
        type: DataTypes.DATE
    },
    
}, {
    indexes: [
        {
            unique: true,
            fields: ["token"]
        }
    ]
})

Token.belongsTo(Auth, { foreignKey: "username" })


module.exports = Token