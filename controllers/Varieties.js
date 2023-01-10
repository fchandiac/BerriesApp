const {Varieties} = require('../db')
const varieties = {}

async function create(name, price){
    const variety = await Varieties.create({
        name:name,
        price:price
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return variety
}

async function findOneByName(name){
    const variety = await Varieties.findOne({
        where:{name:name}
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return variety
}

async function findAll(){
    const variety = await Varieties.findAll().then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return variety
}

async function destroy(id){
    const variety = await Varieties.destroy({
        where:{id:id}
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return variety
}

async function update(id, name, price){
    const variety = await Varieties.update({
        name:name,
        price:price
    }, {where:{id:id}}).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return variety

}


varieties.create = create
varieties.findOneByName = findOneByName
varieties.findAll = findAll
varieties.destroy = destroy
varieties.update = update

module.exports = varieties