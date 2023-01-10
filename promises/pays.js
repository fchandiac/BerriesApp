const config = require('../config.json')
const server_url = config.server_url

function create(amount, state, payment, balance, method, reception_id, producer_id) {
    let data = { amount, state, payment, balance, method, reception_id, producer_id }
    const pay = new Promise((resolve, reject) => {
        fetch(server_url + 'pays/create', {
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
    return pay
}



function findAllBetweenDate(start, end) {
    let data = { start, end }
    const pay = new Promise((resolve, reject) => {
        fetch(server_url + 'pays/findAllBetweenDate', {
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
    return pay
}

function findAllbyStateAndProducer(state, producer_id) {
    let data = { state, producer_id }
    const pay = new Promise((resolve, reject) => {
        fetch(server_url + 'pays/findAllbyStateAndProducer', {
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
    return pay
}

function update(id, amount, state, payment, balance, method) {
    let data = { id, amount, state, payment, balance, method }
    const pay = new Promise((resolve, reject) => {
        fetch(server_url + 'pays/update', {
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
    return pay
}



function destroyByReception(reception_id) {
    let data = { reception_id }
    const pay = new Promise((resolve, reject) => {
        fetch(server_url + 'pays/destroyByReception', {
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
    return pay
}

function findByReception(reception_id) {
    let data = { reception_id }
    const pay = new Promise((resolve, reject) => {
        fetch(server_url + 'pays/findByReception', {
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
    return pay
}

export { create, findAllBetweenDate, findAllbyStateAndProducer, update, destroyByReception, findByReception }