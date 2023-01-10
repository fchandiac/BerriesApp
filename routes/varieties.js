const express = require('express')
const router = express.Router()
const path = require('path')
const varieties = require( '../controllers/varieties')


router.post('/varieties/create', (req, res) => {
    varieties.create(req.body.name, req.body.price)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/varieties/findOneByName', (req, res) => {
    varieties.findOneByName(req.body.name)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.get('/varieties/findAll', (req,res) => {
    varieties.findAll()
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/varieties/destroy', (req, res) => {
    varieties.destroy(req.body.id)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/varieties/update', (req, res) => {
    varieties.update(req.body.id, req.body.name, req.body.price)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})


module.exports = router