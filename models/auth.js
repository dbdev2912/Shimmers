const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/db')

const Account = sequelize.define('account',{
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            len: [8, 255]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

})



module.exports = Account