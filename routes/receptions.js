const express = require('express')
const router = express.Router()
const receptions = require('../controllers/receptions')

router.post('/receptions/create', (req, res) => {
    receptions.create(
        req.body.guide,
        req.body.price,
        req.body.trays_quanty,
        req.body.gross,
        req.body.net,
        req.body.discount,
        req.body.returned_trays,
        req.body.driver,
        req.body.producer_id,
        req.body.variety_id
    ).then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.get('/receptions/findAll', (req, res) => {
    receptions.findAll()
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/receptions/destroy', (req, res) => {
    receptions.destroy(req.body.id)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

module.exports = router