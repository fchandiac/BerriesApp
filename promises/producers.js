const config = require('../config.json')
const server_url = config.server_url


function create(rut, name, phone, mail, address) {
    let data = { 'rut': rut, 'name': name, 'phone': phone, 'mail': mail, 'address': address }
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/create', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return producer
}

function findOneById(id) {
    let data = {'id':id }
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/findOneById', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })

    return producer
}

function findAll() {
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/findAll', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return producer
}

function destroy(id) {
    let data = {'id':id }
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/destroy', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })

    return producer
}

function update(id, rut, name, phone, mail, address) {
    let data = { 'id':id,'rut': rut, 'name': name, 'phone': phone, 'mail': mail, 'address': address }
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/update', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })

    return producer
}

function findOneByName(name) {
    let data = {'name':name }
    const producer = new Promise((resolve, reject) => {
        fetch(server_url + 'producers/findOneByName', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })

    return producer
}

export { create, findOneById, findAll, destroy, update, findOneByName }