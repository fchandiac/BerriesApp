const { Receptions, Varieties, Producers } = require('../db')
const receptions = {}

async function create(
    guide,
    price,
    trays_quanty,
    gross,
    net,
    discount,
    returned_trays,
    driver,
    producer_id,
    variety_id
) {
    const reception = await Receptions.create({
        guide: guide,
        price: price,
        trays_quanty: trays_quanty,
        gross: gross,
        net: net,
        discount: discount,
        returned_trays: returned_trays,
        driver: driver,
        producer_id: producer_id,
        variety_id: variety_id
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return reception
}

async function findAll(){
    const reception = await Receptions.findAll({
        include:[{model:Varieties}, {model:Producers} ],
        order: [
            ['created_at', 'DESC'],
        ]
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return reception
}

async function destroy(id){
    const reception = await Receptions.destroy({
        where:{id:id}
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return reception
}

receptions.create = create
receptions.findAll = findAll
receptions.destroy = destroy

module.exports = receptions