const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connect");

const AddOn = sequelize.define("AddOn", 
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        image: { type: DataTypes.STRING, allowNull: true }
    },
    {
        tableName: "add_on",
        timestamps: true
    }
)

module.exports = AddOn