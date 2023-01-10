'use strict';
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Varieties extends Model { }
    Varieties.init({

        name: { type: DataTypes.STRING },
        price: { type: DataTypes.INTEGER, defaultValue: 0 }

    }, {
        sequelize,
        modelName: 'Varieties',
        underscored: true

    })
    return Varieties
}