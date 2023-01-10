const express = require('express')
const router = express.Router()
const pays = require('../controllers/pays')

router.post('/pays/create', (req, res) => {
    pays.create(
        req.body.amount,
        req.body.state,
        req.body.payment,
        req.body.balance,
        req.body.method,
        req.body.reception_id,
        req.body.producer_id,
    ).then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/pays/update', (req, res) => {
    pays.update(
        req.body.id,
        req.body.amount,
        req.body.state,
        req.body.payment,
        req.body.balance,
        req.body.method
    ).then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/pays/findAllBetweenDate', (req, res) => {
    pays.findAllBetweenDate(req.body.start, req.body.end)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/pays/findAllbyStateAndProducer', (req, res) => {
    pays.findAllbyStateAndProducer(req.body.state, req.body.producer_id)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/pays/destroyByReception', (req,res) => {
    pays.destroyByReception(req.body.reception_id)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/pays/findByReception', (req,res) => {
    pays.findByReception(req.body.reception_id)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

module.exports = router