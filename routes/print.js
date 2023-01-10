const express = require('express')
const router = express.Router()
const escpos = require('escpos')

escpos.USB = require('escpos-usb')

router.get('/print/test', (req, res) => {
    test()
    .then(() => {
        res.json({ status: 'success' })
    }).catch(err => {
        console.log(err)
        res.json(err)
    })


})


router.post('/print/ticket', (req, res) => {
    printTicket(req.body.image)
        .then(() => {
            res.json({ status: 'success' })
        }).catch(err => {
            console.log(err)
            res.json(err)
        })


    // idVendor: 1155,
    // idProduct: 22339


    // const devices = escpos.USB.findPrinter();
    // console.log(devices)
    // try {
    //     const device = new escpos.USB(1155, 22339)
    //     const options = { encoding: "GB18030" /* default */ }
    //     const printer = new escpos.Printer(device)
    //     escpos.Image.load(req.body.image, function (image) {
    //         device.open(function () {
    //             printer.align('ct')
    //                 .image(image, 'd24')
    //                 .then(() => {
    //                     printer.cut().close()
    //                 })
    //         })
    //     })
    //     res.json(
    //         { status: 'success' }
    //     )

    // } catch (e) {

    //     console.log(e);
    //     res.json(e)
    // }

})


function printTicket(image) {
    const print = new Promise((resolve, reject) => {
        try {
            const device = new escpos.USB(1155, 22339)
            const options = { encoding: "GB18030" /* default */ }
            const printer = new escpos.Printer(device)
            escpos.Image.load(image, function (image) {
                device.open(function () {
                    printer.align('ct')
                        .image(image, 'd24')
                        .then(() => {
                            printer.text('')
                            printer.cut().close()
                        })
                })
            })
            resolve()

        } catch (err) {
            //console.log(e)
            reject({ 'code': 0, 'data': err })
        }


    })
    return print
}


function test() {
    const print = new Promise((resolve, reject) => {
        try {
            // const devices = escpos.USB.findPrinter();
            // console.log(devices) 
            const device = new escpos.USB(1155, 22339)
            const options = { encoding: "GB18030" /* default */ }
            const printer = new escpos.Printer(device)
            resolve()
        } catch (err) {
            reject({ 'code': 0, 'data': err })
        }
    })
    return print
}




module.exports = router


