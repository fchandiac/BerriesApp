'use strict';
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Pays extends Model { }
    Pays.init({
        amount: { type: DataTypes.INTEGER },
        state: { type: DataTypes.BOOLEAN},
        payment: { type: DataTypes.INTEGER },
        balance: { type: DataTypes.INTEGER },
        method: { type: DataTypes.INTEGER },
        reception_id: { type: DataTypes.INTEGER },
        producer_id: { type: DataTypes.INTEGER },

    }, {
        sequelize,
        modelName: 'Pays',
        underscored: true
    })
    return Pays
}