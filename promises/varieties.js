
const config = require('../config.json')
const server_url = config.server_url



function findAll() {
    const variety = new Promise((resolve, reject) => {
        fetch(server_url + 'varieties/findAll', {
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
        }).catch(err => {reject(err)})
    })
    return variety 
}

function destroy(id) {
    let data = {id }
    const variety = new Promise((resolve, reject) => {
        fetch(server_url + 'varieties/destroy', {
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

    return variety
}

function create(name, price) {
    let data = {name, price }
    const variety = new Promise((resolve, reject) => {
        fetch(server_url + 'varieties/create', {
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

    return variety
}



function findOneByName(name) {
    let data = {name }
    const variety = new Promise((resolve, reject) => {
        fetch(server_url + 'varieties/findOneByName', {
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

    return variety
}

function update(id, name, price) {
    let data = {id, name, price }
    const variety = new Promise((resolve, reject) => {
        fetch(server_url + 'varieties/update', {
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
    return variety
}

export { findAll, destroy, create, findOneByName, update}