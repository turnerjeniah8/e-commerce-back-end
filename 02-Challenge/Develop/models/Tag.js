const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Tag extends Model {}

Tag.init(
  {
    id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    primaryKey: true, 
    autoIncrement: true,
    },
    tag_name: {
      type: DataTypes.STRING,
    },
    product_id: {
      type: DataTypes.INTEGER,
      //references the product model id here
      references: {
        model: 'product',
        key: 'id',
     },
    },

    tag_id: {
      type: DataTypes.INTEGER,
      //references the tag model id here
      references: {
        model: 'tag',
        key: 'id',
     },
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
  }
);

module.exports = Tag;
