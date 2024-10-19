const { DataTypes, Model } = require('sequelize')
const sequelize = require('../config/db')
const { status, repetition, categories } = require('./modelEnums');
const User = require('./user')

const ScheduledReminders = sequelize.define('scheduled_reminders', {
    reminder_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.TEXT,
        defaultValue: "Nhắc nhở mới",             
    },
    description: DataTypes.TEXT,
    time: {
        type: DataTypes.TIME     
    },
    place: {
        type: DataTypes.TEXT,
        defaultValue: "---"
    },
    tag: DataTypes.TEXT,
    repeat: {
        type: DataTypes.ENUM,
        values: repetition,
        allowNull: false,
        defaultValue: repetition[0]
    },
    status: {
        type: DataTypes.ENUM,
        values: status,
        allowNull: false,
        defaultValue: status[0],
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    createdAt: 'createAt', 
    updatedAt: 'last_modified', 
})

const ScheduledReminderCategories = sequelize.define('scheduled_reminder_categories', {
    reminder_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM,
        primaryKey: true,
        values: categories,
        allowNull: false
    },
},{
    indexes: [
        {
            unique: true,
            fields: [ "reminder_id", "category" ]
        }
    ]
})

ScheduledReminders.belongsTo( User, { foreignKey: "owner" } )
ScheduledReminderCategories.belongsTo( ScheduledReminders, { foreignKey: "reminder_id" })
ScheduledReminders.hasMany(ScheduledReminderCategories, { foreignKey: "reminder_id" })


module.exports = { ScheduledReminders, ScheduledReminderCategories }
