
import Layout from '../components/Layout'
import { Grid, Autocomplete, TextField, Button } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppPaper from '../components/AppPaper'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import moment from 'moment'
import AppErrorSnack from '../components/AppErrorSnack'
import PaysGrid from '../components/Grids/PaysGrid/PaysGrid'


const paysPr = require('../promises/pays')
const producers = require('../promises/producers')
const utils = require('../utils')

export default function pays() {
    const [configData, setConfigData] = useState(configDataDefault())
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [paysGridState, setPaysGridState] = useState(false)
    const [producersOptions, setProducersOptions] = useState([])
    const [producerInput, setProducerInput] = useState('')
    const [paymentData, setPaymentData] = useState(paymentDataDefault())
    const [methodInput, setMethodInput] = useState('')

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
        if (paymentData.producer != null) {
            paysPr.findAllbyStateAndProducer(0, paymentData.producer.id)
                .then(res => {
                    let balanceTotal = 0
                    res.map(item => {
                        balanceTotal = balanceTotal + item.balance
                    })
                    setPaymentData({ ...paymentData, balanceTotal: balanceTotal })
                })
        } else {
            setPaymentData({ ...paymentData, balanceTotal: 0 })
        }

    }, [paymentData.producer])

 


    const updatePaysGridState = () => {
        let gridState = paysGridState == false ? true : false
        setPaysGridState(gridState)
    }

    const submit = (e) => {
        e.preventDefault()
        
        // console.log(paymentData.payment)
        if (utils.moneyToInt(paymentData.payment) > paymentData.balanceTotal){
            setErrorText('Monto de abono superior al saldo total del productor')
            setOpenSnack(true)
        } else {
            paysPr.findAllbyStateAndProducer(0, paymentData.producer.id)
            .then(res => {
                let payementPromises = []
                let money = utils.moneyToInt(paymentData.payment)
                res.map(item => {
                    console.log(money)
                    if(money >= 1){
                        if((money >= item.balance)){
                            payementPromises.push(paysPr.update(item.id, item.amount, 1, item.amount, 0, paymentData.method.key))
                            money = money - item.balance
                        } else if (money < item.balance) {
                            payementPromises.push(paysPr.update(item.id, item.amount, 0, (money + item.payment), (item.amount - (money + item.payment)), paymentData.method.key))
                            money = money
                        }
                    }

                    Promise.all(payementPromises)
                    .then(() => {
                        setPaymentData(paymentDataDefault())
                        updatePaysGridState()
                    })
                    .catch(err => {console.error(err)})
                })
           


            })
            .catch(err => {console.error(err)})

        }
        


        // if (checkDates(configData.start, configData.end) == true) {
        //     setErrorText('La fecha de inicio no puede ser posterior a la de fin')
        //     setOpenSnack(true)
        // } else {
        //     paysPr.findAllBetweenDate(configData.start, configData.end)
        //         .then(res => { console.log(res) })
        //         .catch(err => { console.error(err) })
        // }

    }

    const test = () => {
        paysPr.findAllbyStateAndProducer(0, 1002)
            .then(res => { console.log(res) })
    }
    return (
        <>
            <Layout pageTitle={'Pagos'}>
                <Grid container spacing={1}>
                    <Grid item xs={3} sm={3} md={3}>
                        <Grid container spacing={1} direction='column'>
                            <Grid item>
                                <AppPaper title={'Configuración reporte'}>

                                    <Grid container spacing={1} direction={'column'} padding={1}>
                                        <Grid item >
                                            <DesktopDatePicker
                                                label="Inicio"
                                                inputFormat='DD-MM-YYYY'
                                                value={configData.start}
                                                onChange={(e) => {
                                                    setConfigData({
                                                        ...configData,
                                                        start: moment(e).format('YYYY-MM-DD')
                                                    })
                                                }}
                                                renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
                                            />
                                        </Grid>
                                        <Grid item >
                                            <DesktopDatePicker
                                                label="Fin"
                                                inputFormat='DD-MM-YYYY'
                                                value={configData.end}
                                                onChange={(e) => {
                                                    setConfigData({
                                                        ...configData,
                                                        end: moment(e).format('YYYY-MM-DD 23:59')
                                                    })
                                                    console.log(configData.end)
                                                }}
                                                renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
                                            />
                                        </Grid>
                                    </Grid>

                                </AppPaper>
                                <AppErrorSnack openSnack={openSnack} errorText={errorText} setOpenSnack={setOpenSnack} />

                            </Grid>
                            <Grid item>
                                <AppPaper title={'Nuevo Abono'}>
                                    <form onSubmit={submit}>
                                        <Grid container spacing={1} direction='column' padding={1}>
                                            <Grid item>
                                                <Autocomplete
                                                    inputValue={producerInput}
                                                    onInputChange={(e, newInputValue) => {
                                                        setProducerInput(newInputValue);
                                                    }}
                                                    value={paymentData.producer}
                                                    onChange={(e, newValue) => {
                                                        setPaymentData({ ...paymentData, producer: newValue })
                                                    }}
                                                    isOptionEqualToValue={(option, value) => option.key === value.key}
                                                    disablePortal
                                                    options={producersOptions}
                                                    renderInput={(params) => <TextField {...params} label='Productor' size={'small'} fullWidth required />}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    label='Rut'
                                                    value={(paymentData.producer == null) ? '' : paymentData.producer.rut}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    size={'small'}
                                                    variant={'outlined'}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    label='Saldo Total Productor'
                                                    value={(paymentData.balanceTotal == null) ? '' : utils.renderMoneystr(paymentData.balanceTotal)}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    size={'small'}
                                                    variant={'outlined'}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    label='Monto abono'
                                                    value={(paymentData.payment == null) ? '' : paymentData.payment}
                                                    onChange={(e) => { setPaymentData({ ...paymentData, payment: utils.renderMoneystr(e.target.value) }) }}
                                                    size={'small'}
                                                    variant={'outlined'}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Autocomplete
                                                    inputValue={methodInput}
                                                    onInputChange={(e, newInputValue) => {
                                                        setMethodInput(newInputValue);
                                                    }}
                                                    value={paymentData.method}
                                                    onChange={(e, newValue) => {
                                                        setPaymentData({ ...paymentData, method: newValue })
                                                    }}
                                                    isOptionEqualToValue={(option, value) => option.key === value.key}
                                                    disablePortal
                                                    options={[{ label: 'efectivo', key: 0}, { label: 'transferencia', key: 1  }, {label: 'cheque', key: 2}]}
                                                    renderInput={(params) => <TextField {...params} label='Medio de pago' size={'small'} fullWidth required />}
                                                />
                                            </Grid>
                                            <Grid item textAlign={'right'}>
                                                <Button variant='contained' type='submit'>Abonar</Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </AppPaper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={9} sm={9} md={9}>
                        <PaysGrid update={updatePaysGridState} configData={configData} />
                    </Grid>
                </Grid>
            </Layout>
        </>
    )
}

function checkDates(start, end) {
    var startDate = moment(start)
    var endDate = moment(end)
    var result = endDate.isBefore(startDate, 'date')
    return result
}

function configDataDefault() {
    return ({
        start: moment(new Date).format('YYYY-MM-DD'),
        end: moment(new Date).format('YYYY-MM-DD 23:59'),
    })
}

function paymentDataDefault() {
    return ({
        producer: { key: 1001, id: 0, label: '', rut: '' },
        balanceTotal: 0,
        payment: '',
        method: {label: 'efectivo', key: 0}
    })
}