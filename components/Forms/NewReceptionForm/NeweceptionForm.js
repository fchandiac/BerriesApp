import {
    Grid, TextField, Button, Autocomplete, Divider, FormControlLabel, Switch,
    Dialog, DialogTitle, DialogActions, DialogContent, CardMedia, Box, Card, Typography
} from '@mui/material'
import moment from 'moment'
import { React, useState, useEffect, useRef } from 'react'
import AppPaperNoTitle from '../../AppPaperNoTitle'
import ReactToPrint from 'react-to-print'
import download from 'downloadjs'

import * as htmlToImage from 'html-to-image'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
import AppErrorSnack from '../../AppErrorSnack'
import AppSuccessSnack from '../../AppSuccessSnack'

const producers = require('../../../promises/producers')
const varieties = require('../../../promises/varieties')
const receptions = require('../../../promises/receptions')
const trays = require('../../../promises/trays')
const utils = require('../../../utils')
const pays = require('../../../promises/pays')
const print = require('../../../promises/print')


export default function NeweceptionForm() {
    const [receptionData, setReceptionData] = useState(receptionDataDefault())
    const [producersOptions, setProducersOptions] = useState([])
    const [producerInput, setProducerInput] = useState('')
    const [varietyOptions, setVarietiesOptions] = useState([])
    const [varietyInput, setVarietyInput] = useState('')
    const [trayOptions, setTrayOptions] = useState([])
    const [trayInput, setTrayInput] = useState('')
    const [openTicketDialog, setOpenTicketDialog] = useState(false)
    const [methodInput, setMethodInput] = useState('')
    const printComponentRef = useRef()
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [openSuccesSnack, setSuccesOpenSnack] = useState(false)
    const [succesText, setSuccesText] = useState('')




    useEffect(() => {
        producers.findAll()
            .then(res => {
                let data = res.map(item =>
                ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    rut: item.rut
                })
                )
                setProducersOptions(data)
            })
            .catch(err => { console.log(err) })
    }, [])

    useEffect(() => {
        varieties.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    price: item.price
                }))
                setVarietiesOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [])

    useEffect(() => {
        trays.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    id: item.id,
                    label: item.name,
                    weight: item.weight
                }))
                setTrayOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [])



    useEffect(() => {
        // if(receptionData.tray == null){
        //     setReceptionData({...receptionData, tray: { key: 0, id: 0, label: '', weight: 0 }})
        // } else {

        // }

        setReceptionData({
            ...receptionData,
            discount: parseFloat(receptionData.trays_quanty * (receptionData.tray == null ? 0 : receptionData.tray.weight)).toFixed(2)
        })

    }, [receptionData.trays_quanty, (receptionData.tray)])

    useEffect(() => {
        setReceptionData({
            ...receptionData,
            net: parseFloat(receptionData.gross - receptionData.discount).toFixed(2)
        })

    }, [receptionData.gross, receptionData.discount])

    useEffect(() => {
        setReceptionData({
            ...receptionData,
            pay: parseFloat(parseFloat(receptionData.net) * utils.moneyToInt(receptionData.price)).toFixed(0)
        })
    }, [receptionData.net, receptionData.price])

    const submit = (e) => {
        e.preventDefault()
        if(utils.moneyToInt(receptionData.pay)< 0){
            setErrorText('El total a pagar no puede ser menor a $0')
            setOpenSnack(true)
        } else {
            setOpenTicketDialog(true)
        }
        
    }

    const payment_method_options = [
        { key: 0, label: 'efectivo' },
        { key: 1, label: 'transferencia' },
        { key: 2, label: 'cheque' },
    ]

    const proccess = () => {
        print.test()
            .then(() => {
                receptions.create(
                    receptionData.guide,
                    utils.moneyToInt(receptionData.price),
                    receptionData.trays_quanty,
                    receptionData.gross,
                    receptionData.net,
                    receptionData.discount,
                    receptionData.returned_trays,
                    receptionData.driver,
                    receptionData.producer.id,
                    receptionData.variety.id
                )
                    .then(res => {
                        console.log(res)
                        setReceptionData({ ...receptionData, id: res.id })
                        let amount = receptionData.pay
                        let state = receptionData.pay_state
                        let payment = receptionData.pay_state == true ? receptionData.pay : 0
                        let balance = amount - payment
                        let method = receptionData.pay_state == true ? receptionData.method.key : null
                        let reception_id= res.id
                        pays.create(amount, state, payment, balance, method, res.id, receptionData.producer.id)
                            .then(res => {
                                printTicket()
                                //console.log(res)
                                // setReceptionData(receptionDataDefault())
                                // setOpenTicketDialog(false)
                            })
                            .catch(err => { console.error(err) })
                    })
                    .catch(err => { console.error(err) })

            })
            .catch(err => {
                setErrorText('Error de comunicación con la impresora')
                setOpenSnack(true)
            })

    }

    const save = () => {
        receptions.create(
            receptionData.guide,
            utils.moneyToInt(receptionData.price),
            receptionData.trays_quanty,
            receptionData.gross,
            receptionData.net,
            receptionData.discount,
            receptionData.returned_trays,
            receptionData.driver,
            receptionData.producer.id,
            receptionData.variety.id
        )
            .then(res => {
                console.log(res)
                setReceptionData({ ...receptionData, id: res.id })
                let amount = receptionData.pay
                let state = receptionData.pay_state
                let payment = receptionData.pay_state == true ? receptionData.pay : 0
                let balance = amount - payment
                let method = receptionData.pay_state == true ? receptionData.method.key : null
                let reception_id= res.id
                pays.create(amount, state, payment, balance, method, res.id, receptionData.producer.id)
                    .then(res => {
                        
                        setSuccesText('Recpeción guardada con id: ' + reception_id)
                        setSuccesOpenSnack(true)
                        setTimeout(() => {setOpenTicketDialog(false), setReceptionData(receptionDataDefault())}, 3000)
                        
                        
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })
    }

    const printTicket = () => {
        htmlToImage.toPng(printComponentRef.current)
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                //download(dataUrl, 'my-node.png')
                print.ticket(img.src)
                    .then(() => {
                        setReceptionData(receptionDataDefault())
                        setOpenTicketDialog(false)
                        // setSuccesText('Recpeción guardada con id: ' + reception_id)
                        // setSuccesOpenSnack(true)
                        // setTimeout(() => {setOpenTicketDialog(false), setReceptionData(receptionDataDefault())}, 3000)
                    })
                    .catch(err => {
                        setErrorText('Error de comunicación con la impresora')
                        setOpenSnack(true)
                    })

                //console.log(img.src)
                //document.body.appendChild(img);
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
        //console.log(printComponentRef.current)

    }

    return (
        <>
            <AppPaperNoTitle>
                <form onSubmit={submit}>
                    <Grid container spacing={1} padding={1} marginTop={1}>
                        <Grid container spacing={1} item xs={12} sm={12} md={12}>
                            <Grid item xs={6} sm={6} md={6}>
                                <Autocomplete
                                    inputValue={producerInput}
                                    onInputChange={(e, newInputValue) => {
                                        setProducerInput(newInputValue);
                                    }}
                                    value={receptionData.producer}
                                    onChange={(e, newValue) => {
                                        setReceptionData({ ...receptionData, producer: newValue })
                                    }}
                                    disablePortal
                                    options={producersOptions}
                                    renderInput={(params) => <TextField {...params} label='Nombre productor' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} >
                                <TextField
                                    label='Rut'
                                    value={(receptionData.producer == null) ? '' : receptionData.producer.rut}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3}>
                                <TextField label="Guía"
                                    value={(receptionData.guide == null) ? '' : receptionData.guide}
                                    onChange={(e) => {
                                        setReceptionData({ ...receptionData, guide: e.target.value })
                                    }}
                                    type={'number'}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                                <TextField label="Nombre Chófer"
                                    value={(receptionData.driver == null) ? '' : receptionData.driver}
                                    onChange={(e) => {
                                        setReceptionData({ ...receptionData, driver: e.target.value })
                                    }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3}>
                                <Autocomplete
                                    inputValue={varietyInput}
                                    onInputChange={(e, newInputValue) => {
                                        setVarietyInput(newInputValue);
                                    }}
                                    value={receptionData.variety}
                                    onChange={(e, newValue) => {
                                        setReceptionData({ ...receptionData, variety: newValue, price: (newValue == null ? utils.renderMoneystr(0) : utils.renderMoneystr(newValue.price)) })
                                    }}
                                    disablePortal
                                    options={varietyOptions}
                                    renderInput={(params) => <TextField {...params} label='Variedad' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3}>
                                <TextField label="Precio"
                                    value={(receptionData.price == null) ? '' : receptionData.price}
                                    onChange={(e) => {
                                        setReceptionData({ ...receptionData, price: utils.renderMoneystr(e.target.value) })
                                    }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3}>
                                <Autocomplete
                                    inputValue={trayInput}
                                    onInputChange={(e, newInputValue) => {
                                        setTrayInput(newInputValue);
                                    }}
                                    value={receptionData.tray}
                                    onChange={(e, newValue) => {
                                        setReceptionData({ ...receptionData, tray: newValue })
                                    }}
                                    disablePortal
                                    options={trayOptions}
                                    renderInput={(params) => <TextField {...params} label='Bandeja' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} >
                                <TextField
                                    label='Kg Bandeja'
                                    value={(receptionData.tray == null) ? '' : receptionData.tray.weight}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3}>
                                <TextField label="Cantidad de bandejas"
                                    value={(receptionData.trays_quanty == null) ? '' : receptionData.trays_quanty}
                                    onChange={(e) => {
                                        setReceptionData({ ...receptionData, trays_quanty: e.target.value })
                                    }}
                                    InputProps={{ inputProps: { min: 0 } }}
                                    type={'number'}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} >
                                <TextField
                                    label='Descuento Kg'
                                    value={(receptionData.discount == null) ? '' : receptionData.discount}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} >
                                <TextField label="Kg bruto"
                                    value={receptionData.gross}
                                    onChange={(e) => { setReceptionData({ ...receptionData, gross: e.target.value }) }}
                                    variant="outlined"
                                    type={'number'}
                                    inputProps={{ step: "0.01", inputProps: { min: 0 } }}
                                    size={'small'}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} >
                                <TextField
                                    label='Kg Neto'
                                    value={(receptionData.net == null) ? '' : receptionData.net}
                                    InputProps={{
                                        readOnly: true,
                                        min: 0,
                                    }}
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} >
                                <TextField
                                    label='A pagar'
                                    value={utils.renderMoneystr(receptionData.pay)}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    size={'small'}
                                    variant={'outlined'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} >
                                <TextField label="Bandejas devueltas"
                                    value={receptionData.returned_trays}
                                    onChange={(e) => { setReceptionData({ ...receptionData, returned_trays: e.target.value }) }}
                                    variant="outlined"
                                    type={'number'}
                                    size={'small'}
                                    InputProps={{ inputProps: { min: 0, max: receptionData.trays_quanty } }}

                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} >
                                <FormControlLabel
                                    control=
                                    {<Switch
                                        checked={receptionData.pay_state}
                                        onChange={(e) => { setReceptionData({ ...receptionData, pay_state: e.target.checked }) }}
                                    />} label="Pago contra recepción" />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} sx={{ ...(receptionData.pay_state == false && { display: 'none' }) }}>
                                <Autocomplete
                                    inputValue={methodInput}
                                    onInputChange={(e, newInputValue) => {
                                        setMethodInput(newInputValue);
                                    }}
                                    value={receptionData.method}
                                    onChange={(e, newValue) => {
                                        setReceptionData({ ...receptionData, method: newValue })
                                    }}
                                    disablePortal
                                    options={payment_method_options}
                                    renderInput={(params) => <TextField {...params} label='Medio de pago' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign={'right'}>
                                <Button variant='contained' type='submit'>Vista previa ticket</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </AppPaperNoTitle>
            <Dialog open={openTicketDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2, displayPrint: 'none' }}>
                    Vista previa ticket
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Box ref={printComponentRef}>
                        <Grid container>
                            <Grid item xs={4} sm={4} md={4}>
                                <CardMedia
                                    sx={{ height: '120px', width: '120px' }}
                                    image='http://localhost:3001/logoBerries.png' />

                            </Grid>
                            <Grid item xs={8} sm={8} md={8}>
                                <Typography fontSize={20}>Recepción Maureira</Typography>
                                <Typography fontSize={20}>17.332.699-8</Typography>
                                <Typography fontSize={20}>Los cuarteles - Hijuela 20, Parral</Typography>
                                <Typography fontSize={20}>952242741</Typography>
                            </Grid>
                        </Grid>
                        <Divider />
                        <Typography fontSize={20}>Recepción Nº: {receptionData.id}</Typography>
                        <Typography fontSize={20}>Fecha: {moment(new Date()).format('DD-MM-YYYY')}</Typography>
                        <Typography fontSize={20}>Hora: {moment(new Date()).format('HH:mm')}</Typography>
                        <Typography fontSize={20}>Productor: {receptionData.producer == null ? '' : receptionData.producer.label}</Typography>
                        <Typography fontSize={20}>Rut: {receptionData.producer == null ? '' : receptionData.producer.rut}</Typography>
                        <Typography fontSize={20}>Chófer: {receptionData.driver}</Typography>
                        <Typography fontSize={20}>Guía: {receptionData.guide}</Typography>
                        {/* <Typography fontSize={20}>Bandeja: {receptionData.tray == null ? '' : receptionData.tray.label}</Typography> */}
                        <Typography fontSize={20}>Variedad: {receptionData.variety == null ? '' : receptionData.variety.label}</Typography>
                        <Typography fontSize={20}>Precio: {receptionData.price == null ? '' : receptionData.price}</Typography>
                        <Divider />
                        <Typography fontSize={24}>Cantidad bandejas: {receptionData.trays_quanty}</Typography>
                        <Typography fontSize={24}>Kg Bruto: {receptionData.gross}</Typography>
                        <Typography fontSize={24}>Descuento Kg: {receptionData.discount}</Typography>
                        <Typography fontSize={24}>Kg Neto: {receptionData.net}</Typography>
                        <Divider />
                        <Typography textAlign={'center'} fontSize={28}> A pagar: {utils.renderMoneystr(receptionData.pay)}</Typography>
                        <Divider />
                        <Typography fontSize={20}>Bandejas devueltas: {receptionData.returned_trays}</Typography>
                        <Typography fontSize={20}>Estado del pago: {receptionData.pay_state == true ? 'pagado' : 'pendiente'}</Typography>

                    </Box>
                </DialogContent>
                <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    {/* <Button variant={'contained'} onClick={printTicket} >imprimir</Button> */}
                    {/* <ReactToPrint
                        trigger={() => <Button variant={'contained'} >imprimir</Button>}
                        content={() => printComponentRef.current}
                        debug={true}
                    //onAfterPrint={() => { closeDialog() }}
                    /> */}
                    <Button variant={'contained'} onClick={save} >Guardar</Button>
                    <Button variant={'contained'} onClick={proccess} >Guardar e imprimir</Button>
                    <Button variant={'outlined'} onClick={() => { setOpenTicketDialog(false) }} >cerrar</Button>
                </DialogActions>
            </Dialog>
            <AppErrorSnack openSnack={openSnack} errorText={errorText} setOpenSnack={setOpenSnack} />
            <AppSuccessSnack openSnack={openSuccesSnack} errorText={succesText} setOpenSnack={setSuccesOpenSnack}/>
        </>
    )
}

function receptionDataDefault() {
    return ({
        id: '',
        guide: '',
        price: '',
        trays_quanty: '',
        gross: '',
        net: 0,
        discount: 0,
        returned_trays: '',
        driver: '',
        pay: '',
        pay_state: false,
        producer: { key: 0, id: 0, label: '', rut: '' },
        variety: { key: 0, id: 0, label: '', price: 0 },
        tray: { key: 0, id: 0, label: '', weight: 0 },
        method: { key: 0, label: 'efectivo' }
    })
}
