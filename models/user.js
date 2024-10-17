const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Auth = require('./auth')

const { emailRegEx } = require('../config/enum')

const User = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    fullname: {
        type: DataTypes.STRING,
        validate: {
            len: [1, 255]
        }
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            is: emailRegEx
        }        
    },
    phone: {
        type: DataTypes.STRING,
        validate: {
            len: [8, 20]
        }     
    },
    avatar: {
        type: DataTypes.STRING
    }

})

User.belongsTo(Auth, { foreignKey: "username" })

module.exports = User