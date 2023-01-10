const {Trays} = require('../db')
const trays = {}

async function create(name, weight){
    const tray = await Trays.create({
        name: name, 
        weight: weight
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return tray
}

async function findAll(){
    const tray = await Trays.findAll()
    .then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return tray
}

async function destroy(id){
    const tray = await Trays.destroy({
        where: {id:id}
    }).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return tray
}

async function update(id, name, weight){
    const tray = await Trays.update({
        name: name, 
        weight: weight
    }, {where: {id:id}}).then(data => { return { 'code': 1, 'data': data } }).catch(err => { return { 'code': 0, 'data': err } })
    return tray
        
}

trays.create = create
trays.findAll = findAll
trays.destroy = destroy
trays.update = update

module.exports = trays