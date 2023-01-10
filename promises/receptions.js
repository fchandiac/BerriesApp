const config = require('../config.json')
const server_url = config.server_url


function create(
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
    let data = {
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
    }
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/create', {
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
    return reception
}

function findAll() {
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/findAll', {
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
    return reception
}

function destroy(id) {
    let data = {id}
    const reception = new Promise((resolve, reject) => {
        fetch(server_url + 'receptions/destroy', {
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
    return reception
}


export {create, findAll, destroy}