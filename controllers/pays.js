const { Pays, Receptions, Producers } = require('../db')
const pays = {}
const sequelize = require('sequelize')


async function create(
    amount,
    state,
    payment,
    balance,
    method,
    reception_id,
    producer_id,
) {
    const pay = await Pays.create({
        amount: amount,
        state: state,
        payment: payment,
        balance: balance,
        method: method,
        reception_id: reception_id,
        producer_id: producer_id,
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return pay
}

async function update(
    id,
    amount,
    state,
    payment,
    balance,
    method
) {
    const pay = await Pays.update({
        amount: amount,
        state: state,
        payment: payment,
        balance: balance,
        method: method
    }, {where:{id:id}}).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return pay
}

async function findAllBetweenDate(start, end){
    const pay = await Pays.findAll({
        include: [Receptions, Producers],
        where: { createdAt: { [sequelize.Op.between]: [start, end] }},
        order: [
            ['created_at', 'DESC'],
        ]
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return pay
}

async function findAllbyStateAndProducer(state, producer_id){
    const pay = await Pays.findAll({
        include: [Receptions, Producers],
        where: { state: state, producer_id: producer_id},
        order: [
            ['balance', 'DESC'],
        ]
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return pay
}

async function destroyByReception(reception_id){
    const pay = await Pays.destroy({
        where:{reception_id: reception_id}
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return pay
}

async function findByReception(reception_id){
    const pay = await Pays.findOne({where:{reception_id:reception_id}}).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return pay
}

pays.create = create
pays.update = update
pays.findAllBetweenDate = findAllBetweenDate
pays.findAllbyStateAndProducer = findAllbyStateAndProducer
pays.destroyByReception = destroyByReception
pays.findByReception = findByReception


module.exports = pays