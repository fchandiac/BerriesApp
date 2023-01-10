'use strict';
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Receptions extends Model { }
    Receptions.init({
        guide: { type: DataTypes.STRING },
        price: { type: DataTypes.INTEGER },
        trays_quanty: { type: DataTypes.INTEGER },
        gross: { type: DataTypes.FLOAT },
        net: { type: DataTypes.FLOAT },
        discount: { type: DataTypes.FLOAT },
        returned_trays: { type: DataTypes.INTEGER },
        driver: { type: DataTypes.STRING },
        producer_id: { type: DataTypes.INTEGER },
        variety_id: { type: DataTypes.INTEGER },
    }, {
        sequelize,
        modelName: 'Receptions',
        underscored: true
    })
    return Receptions
}