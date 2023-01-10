const config = require('../config.json')
const server_url = config.server_url

function ticket(image) {
    let data = { image }
    const print = new Promise((resolve, reject) => {
        fetch(server_url + 'print/ticket', {
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
    return print
}

function test() {
    const print = new Promise((resolve, reject) => {
        fetch(server_url + 'print/test', {
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
    return print
}


export {ticket, test}