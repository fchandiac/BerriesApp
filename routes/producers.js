const express = require('express')
const router = express.Router()
const producers = require('../controllers/producers')



router.post('/producers/create', (req, res) => {
    producers.create(req.body.rut, req.body.name, req.body.phone, req.body.mail, req.body.address)
        .then(data => {
            res.json(data)
        }).catch(err => {
            res.json(err)
        })
})

router.post('/producers/findOneById', (req, res) => {
    producers.findOneById(req.body.id)
        .then(data => {
            res.json(data)
        }).catch(err => {
            res.json(err)
        })
})

router.get('/producers/findall', (req, res) => {
    producers.findAll()
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/producers/destroy', (req, res) => {
    producers.destroy(req.body.id)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/producers/update', (req, res) => {
    producers.update(req.body.id, req.body.rut, req.body.name, req.body.phone, req.body.mail, req.body.address)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.post('/producers/findOneByName', (req, res) => {
    producers.findOneByName(req.body.name)
    .then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})


module.exports = router