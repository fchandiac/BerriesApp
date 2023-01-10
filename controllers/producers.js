const { Producers } = require('../db')
const producers = {}

async function create(rut, name, phone, mail, address) {
    const producer = await Producers.create({
        rut: rut,
        name: name,
        phone: phone,
        mail: mail,
        address: address
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return producer
}

async function findAll() {
    const producer = await Producers.findAll()
        .then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return producer
}

async function findOneById(id) {
    const producer = await Producers.findOne({
        where: { id: id }
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return producer
}

async function findOneByName(name) {
    const producer = await Producers.findOne({
        where: { name: name }
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return producer
}

async function destroy(id){
    const producer = await Producers.destroy({
        where: { id: id }
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return producer
}

async function update(id, rut, name, phone, mail, address ){
    const producer = await Producers.update({
        rut:rut, name:name, phone:phone, mail:mail, address:address
    }, {where:{id:id}}).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return producer
}

producers.create = create
producers.findAll = findAll
producers.findOneById = findOneById
producers.destroy = destroy
producers.update = update
producers.findOneByName = findOneByName

module.exports = producers