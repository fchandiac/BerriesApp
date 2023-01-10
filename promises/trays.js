const config = require('../config.json')
const server_url = config.server_url

function create(name, weight) {
    let data = { name, weight }
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/create', {
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
    return tray
}


function destroy(id) {
    let data = {id }
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/destroy', {
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

    return tray
}


function update(id, name, weight) {
    let data = {id, name, weight }
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/update', {
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
    return tray
}

function findAll() {
    const tray = new Promise((resolve, reject) => {
        fetch(server_url + 'trays/findAll', {
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
    return tray
}

export {create, findAll, destroy, update}