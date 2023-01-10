'use strict';
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Producers extends Model { }
    Producers.init({

        rut: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },
        phone: { type: DataTypes.STRING },
        mail: { type: DataTypes.STRING },
        address: { type: DataTypes.STRING }

    }, {
        sequelize,
        modelName: 'Producers',
        underscored: true

    })
    return Producers
}